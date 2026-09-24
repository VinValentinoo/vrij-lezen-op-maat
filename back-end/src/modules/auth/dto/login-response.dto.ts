import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty()
    message?: string;

    @ApiProperty()
    accessToken!: string;
}