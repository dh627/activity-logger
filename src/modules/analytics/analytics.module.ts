import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityList } from 'src/entities/activity-list.entity';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { ActivitiesService } from '../activities/activities.service';
@Module({
  imports: [TypeOrmModule.forFeature([ActivityList, ActivityLog])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, ActivitiesService]
})
export class AnalyticsModule {}
