import { Injectable } from '@nestjs/common';
import { Books } from 'src/entities/books.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksDto } from './dto/books.dto';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Books) private readonly booksRepository: Repository<Books>
    ) {}

    async getAllBooks(): Promise<Books[] | undefined> {
        return await this.booksRepository.find({});
    }

    async getBook(id: number): Promise<Books | undefined> {
        return await this.booksRepository.findOne(id);
    }

    async deleteBook(id: number): Promise<DeleteResult> {
        return await this.booksRepository.delete(id);
    }

    async postBook(bookData: BooksDto): Promise<Books> {
        const book: Books = new Books();
        this.assignBookData(book, bookData);
        return this.booksRepository.save(book);
    }

    private assignBookData(book: Books, bookData: BooksDto) {
        book.title = bookData.title;
        book.author = bookData.author;
        book.category = bookData.category;
        book.status = bookData.status; // make to capital letters 
        book.rating = bookData.rating;
        book.startDate = bookData.startDate;   // make today by default on front end
        book.endDate = bookData.endDate;
    }
}