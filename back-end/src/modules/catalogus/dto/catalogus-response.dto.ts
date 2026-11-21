import { ApiProperty } from '@nestjs/swagger';

export class CatalogusItemResponseDto {
  @ApiProperty({ description: 'MongoDB ObjectId van de titel' })
  _id!: string;

  @ApiProperty()
  titel!: string;

  @ApiProperty()
  beschrijving!: string;

  @ApiProperty({ example: '3F' })
  taalniveau!: string;

  @ApiProperty({ example: 'Boek - roman' })
  genre!: string;

  @ApiProperty({ example: 'reizen' })
  onderwerp!: string;

  @ApiProperty({ example: 'Middel' })
  lengte!: string;
}

export class CatalogusPageResponseDto {
  @ApiProperty({ type: [CatalogusItemResponseDto] })
  items!: CatalogusItemResponseDto[];

  @ApiProperty({
    description: 'Totaal aantal titels dat aan de filters voldoet',
  })
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}
