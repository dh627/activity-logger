import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityList } from 'src/entities/activity-list.entity';
import { Repository, DeleteResult } from 'typeorm';
import { ActivityListDto } from './dto/activity-list.dto';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(ActivityList) private readonly activityListRepository: Repository<ActivityList>
    ){}

    async findAll(): Promise<ActivityList[]>  {
        return await this.activityListRepository.find({});
    }

    async findActivity(id: number): Promise<ActivityList> {
        return await this.activityListRepository.findOne(id);
    }

    async deleteActivity(id: number): Promise<DeleteResult> {
        return await this.activityListRepository.delete(id);
    }

    async postActivity(postData: ActivityListDto): Promise<ActivityList> {
        const activity: ActivityList = new ActivityList();
        activity.name = postData.name;
        activity.dateAdded = new Date();
        return this.activityListRepository.save(activity);
    }
}
