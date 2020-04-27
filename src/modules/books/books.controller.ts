import { Controller, Get, Param, Delete, ParseIntPipe, NotFoundException, Body, Post, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { Books } from 'src/entities/books.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { BooksDto } from './dto/books.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    // Get all books
    @Get("getall")
    // add query parameter - for READ, READING, TO_READ...or maybe new method?
    async getAllBooks(): Promise<Books[] | undefined> {
        // remove undefined from type & throw not found exception instead
        return await this.booksService.getAllBooks()
    }

    // Get book by ID
    @Get("/:id")
    async getBook(@Param("id", new ParseIntPipe()) id: number): Promise<Books> {
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

    // Put book 
    @Put("updatebook/:id")
    @UsePipes(ValidationPipe)
    async updateBook(@Param("id", new ParseIntPipe()) id: number, @Body() updateBookDto: BooksDto): Promise<UpdateResult> {
        const book = await this.booksService.getBook(id);
        if (book === undefined) {
            throw new NotFoundException("invalid-book-id-given");
        }
        return await this.booksService.updateBook(book, updateBookDto); 
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

    // Get currently reading/read/to read books - have a drop down on front end that
    // passes in one of the enums 
}
