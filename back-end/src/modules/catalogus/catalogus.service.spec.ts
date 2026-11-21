import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CatalogusService } from './catalogus.service';
import { CatalogusItem } from './schemas/catalogus-item.schema';

describe('CatalogusService', () => {
  let service: CatalogusService;
  let model: { find: jest.Mock; countDocuments: jest.Mock };
  let skip: jest.Mock;
  let limit: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogusService,
        {
          provide: getModelToken(CatalogusItem.name),
          useValue: {
            find: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatalogusService>(CatalogusService);
    model = module.get(getModelToken(CatalogusItem.name));

    limit = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([{ titel: 'A' }]),
    });
    skip = jest.fn().mockReturnValue({ limit });
    model.find.mockReturnValue({ skip });
    model.countDocuments.mockResolvedValue(183);
  });

  it('gebruikt standaard pagina 1 met 10 items', async () => {
    const result = await service.findAll({});

    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(10);
    expect(result).toMatchObject({ page: 1, pageSize: 10, total: 183 });
  });

  it('berekent skip correct voor een latere pagina', async () => {
    await service.findAll({ page: 3, pageSize: 20 });

    expect(skip).toHaveBeenCalledWith(40);
    expect(limit).toHaveBeenCalledWith(20);
  });

  it('geeft alleen ingevulde filters door aan Mongo', async () => {
    await service.findAll({ genre: 'Dichtbundel', lengte: 'Kort' });

    expect(model.find).toHaveBeenCalledWith({
      genre: 'Dichtbundel',
      lengte: 'Kort',
    });
    expect(model.countDocuments).toHaveBeenCalledWith({
      genre: 'Dichtbundel',
      lengte: 'Kort',
    });
  });
});
