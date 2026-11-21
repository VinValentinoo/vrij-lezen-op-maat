import { ApiProperty } from '@nestjs/swagger';
import { LeesStatus } from '@prisma/client';

// Item zoals getoond op de leeslijst: Postgres (status) + Mongo (titel).
export class LeeslijstItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: LeesStatus, enumName: 'LeesStatus' })
  status!: LeesStatus;

  @ApiProperty({
    required: false,
    description: 'Leeg als de titel niet meer in de catalogus staat',
  })
  titel?: string;

  @ApiProperty({ required: false })
  beschrijving?: string;
}

// Het kale record uit Postgres (response van toevoegen en status wisselen).
export class ReadingListItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  catalogusItemId!: string;

  @ApiProperty({ enum: LeesStatus, enumName: 'LeesStatus' })
  status!: LeesStatus;

  @ApiProperty({ type: String, format: 'date-time' })
  toegevoegdOp!: Date;
}
