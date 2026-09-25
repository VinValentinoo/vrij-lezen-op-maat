import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddLeeslijstItemDto {
  @ApiProperty({ description: 'Catalogus Item Id', required: true })
  @IsMongoId()
  catalogusItemId!: string;
}
