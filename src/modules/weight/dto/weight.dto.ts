import { IsNotEmpty, IsNumber } from "class-validator";

export class WeightDto {
    @IsNotEmpty()
    @IsNumber()
    stone: number;

    @IsNotEmpty()
    @IsNumber()
    pounds: number;
}