import { Controller, Get, Param, Delete, ParseIntPipe, NotFoundException, Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { Books } from 'src/entities/books.entity';
import { DeleteResult } from 'typeorm';
import { BooksDto } from './dto/books.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    // Get all books
    @Get("getall")
    async getAllBooks(): Promise<Books[] | undefined> {
        return await this.booksService.getAllBooks()
    }

    // Get book by ID
    @Get("/:id")
    async getBook(@Param("id", new ParseIntPipe()) id: number) {
        const book = await this.booksService.getBook(id);
        if (book === undefined) {
            throw new NotFoundException("invalid-book-id-given");
        }
        return book;
    }

    // POST book
    @Post("postbook")
    @UsePipes(ValidationPipe)
    async postBook(@Body() booksDto: BooksDto): Promise<Books> {
        return await this.booksService.postBook(booksDto);
    }

    // Delete book
    @Delete("/:id")
    async deleteBook(@Param("id", new ParseIntPipe()) id: number): Promise<DeleteResult> {
        const book = await this.booksService.getBook(id);
        if (book === undefined) {
            throw new NotFoundException("invalid-book-id-given");
        }
        return await this.booksService.deleteBook(book.id);
    }

    // Put book 

    // Get currently reading/read/to read books - have a drop down on front end that
    // passes in one of the enums 
}
