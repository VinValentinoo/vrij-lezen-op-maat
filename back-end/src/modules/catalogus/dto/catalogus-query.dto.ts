import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CatalogusQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    page?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    taalniveau?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    genre?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    onderwerp?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lengte?: string;
}