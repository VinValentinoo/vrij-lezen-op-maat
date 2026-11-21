import { ApiProperty } from '@nestjs/swagger';

export class GekoppeldeStudentUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  naam!: string;

  @ApiProperty()
  email!: string;
}

export class GekoppeldeStudentDto {
  @ApiProperty({ description: 'Id van de koppeling' })
  id!: string;

  @ApiProperty({ type: GekoppeldeStudentUserDto })
  user!: GekoppeldeStudentUserDto;
}
