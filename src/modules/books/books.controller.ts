import { Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    // Get all books
    @Get("")
    async getAllBooks() {
        
    }

    // Get book by ID

    // POST book

    // Delete book

    // Put book 
}
