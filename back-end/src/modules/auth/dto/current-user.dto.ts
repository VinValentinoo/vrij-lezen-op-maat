import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CurrentUserDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  naam!: string;

  @ApiProperty({ enum: Role })
  role!: Role;
}
