import { ApiProperty } from '@nestjs/swagger';

export class AdviesItemDto {
  @ApiProperty({ description: 'MongoDB ObjectId van de aanbevolen titel' })
  catalogusItemId!: string;

  @ApiProperty()
  titel!: string;

  @ApiProperty()
  beschrijving!: string;

  @ApiProperty({ description: 'Waarom deze titel bij het leesprofiel past' })
  motivatie!: string;
}
