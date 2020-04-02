import { IsNotEmpty, IsString } from "class-validator";

export class ActivityListDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}