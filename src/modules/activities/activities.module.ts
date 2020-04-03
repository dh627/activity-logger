import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityList } from 'src/entities/activity-list.entity';
import { ActivityLog } from 'src/entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityList, ActivityLog])],
  controllers: [ActivitiesController],
  providers: [ActivityList, ActivitiesService]
})
export class ActivitiesModule {}
