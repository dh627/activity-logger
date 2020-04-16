import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityList } from 'src/entities/activity-list.entity';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { Streak } from 'src/entities/streak.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ActivityList, ActivityLog, Streak])],
  controllers: [ActivitiesController],
  providers: [ActivityList, ActivitiesService, AnalyticsService]
})
export class ActivitiesModule {}
