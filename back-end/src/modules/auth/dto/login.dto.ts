import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'E-mailadres van de gebruiker' })
  @IsEmail({}, { message: 'Geen geldig e-mailadres opgegeven' })
  email!: string;

  @ApiProperty({ description: 'Wachtwoord van de gebruiker' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
