import { Module } from '@nestjs/common';
import { ActivitiesModule } from "./modules/activities/activities.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from "./config/typeorm.config";
import { BooksModule } from './modules/books/books.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { WeightModule } from './modules/weight/weight.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ActivitiesModule, BooksModule, AnalyticsModule, WeightModule],
  controllers: [],
  providers: [],
})

export class AppModule {}

