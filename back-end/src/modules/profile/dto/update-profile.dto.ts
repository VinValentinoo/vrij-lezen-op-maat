import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiProperty({ description: 'Taalniveau', required: true})
    @IsString()
    @IsNotEmpty()
    taalniveau!: string;

    @ApiProperty({ description: 'Genre', required: true})
    @IsString()
    @IsNotEmpty()
    genre!: string;

    @ApiProperty({ description: 'Onderwerp', required: true})
    @IsString()
    @IsNotEmpty()
    onderwerp!: string;

    @ApiProperty({ description: 'Lengte', required: true})
    @IsString()
    @IsNotEmpty()
    lengte!: string;

    @ApiProperty({ description: 'Leesdoel', required: true})
    @IsString()
    @IsNotEmpty()
    leesdoel!: string;
}