import { ApiProperty } from '@nestjs/swagger';

export class ReadingProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ example: '3F' })
  taalniveau!: string;

  @ApiProperty({ example: 'Boek - roman' })
  genre!: string;

  @ApiProperty({ example: 'reizen' })
  onderwerp!: string;

  @ApiProperty({ example: 'Middel' })
  lengte!: string;

  @ApiProperty()
  leesdoel!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
