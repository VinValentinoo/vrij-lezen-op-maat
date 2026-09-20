import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class KoppelDto {
    @ApiProperty({ description: 'Docenten Id'})
    @IsUUID()
    docentId!: string;
}