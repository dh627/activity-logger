import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Books } from 'src/entities/books.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  providers: [BooksService],
  controllers: [BooksController]
})
export class BooksModule {}
