import { Module } from '@nestjs/common';
import { ActivitiesModule } from "./modules/activities/activities.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from "./config/typeorm.config";
import { BooksModule } from './modules/books/books.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ActivitiesModule, BooksModule],
  controllers: [],
  providers: [],
})

export class AppModule {}

