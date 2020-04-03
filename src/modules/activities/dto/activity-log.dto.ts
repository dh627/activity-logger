
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ActivityLogDto {
    @IsNotEmpty()
    @IsNumber()
    activityId: number;

    @IsOptional()
    @IsNumber()
    time: number;

    @IsOptional() // allow optional for backtracking dates, otherwise, use current date
    date: Date | string;
}