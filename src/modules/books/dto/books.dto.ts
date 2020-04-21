
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsIn } from "class-validator";
import { BookStatus } from "../book-status.enum";

export class BooksDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsNotEmpty()
    @IsIn([BookStatus.TO_READ, BookStatus.READING, BookStatus.FINISHED]) 
    status: BookStatus;

    @IsOptional()
    @IsNumber()
    rating: number;

    @IsOptional()
    startDate: Date | string;

    @IsOptional()
    endDate: Date | string;
}