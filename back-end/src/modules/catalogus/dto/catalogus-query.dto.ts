import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CatalogusQueryDto {
  // @Type(() => Number) + de globale ValidationPipe({ transform: true })
  // zet de querystring ("2") om naar een echt getal, zodat @IsInt/@Min werken.
  // Zonder @Min(1) gaf ?page=0 een negatieve skip en een 500 uit MongoDB.
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

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

  @ApiPropertyOptional({ minimum: 1, maximum: 500, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  pageSize?: number;
}
