import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client'

export class RegisterDto {
    @ApiProperty({ description: 'E-mailadres van de gebruiker'})
    @IsEmail({}, { message: 'Geen geldig e-mailadres opgegeven'})
    email!: string;

    @ApiProperty({ description: 'Wachtwoord van de gebruiker'})
    @IsString()
    @MinLength(8, { message: 'Wachtwoord moet minimaal 8 tekens bevatten'})
    password!: string;

    @ApiProperty({ description: 'Naam van de gebruiker'})
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ enum: Role, description: 'Rol van de gebruiker'})
    @IsEnum(Role, { message: 'Ongeldige rol opgegeven'})
    @IsNotEmpty()
    role!: Role;
}