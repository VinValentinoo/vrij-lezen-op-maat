import { ApiProperty } from '@nestjs/swagger';

export class DocentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  naam!: string;

  @ApiProperty()
  email!: string;
}

export class KoppelingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  docentId!: string;
}
