import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityList } from 'src/entities/activity-list.entity';
import { Repository, DeleteResult, getRepository } from 'typeorm';
import { ActivityListDto } from './dto/activity-list.dto';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { ActivityLogDto } from './dto/activity-log.dto';
@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(ActivityList) private readonly activityListRepository: Repository<ActivityList>,
        @InjectRepository(ActivityLog) private readonly activityLogRepository: Repository<ActivityLog>
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

    async getAllLogs(): Promise<[]> {
        console.log(new Date());
        const data = await getRepository(ActivityLog)
            .createQueryBuilder("activity_log")
            .leftJoin(ActivityList, "ali", "activity_log.activity_id = ali.id")
            .select("activity_log.id, ali.name, activity_log.time, activity_log.date")
            .orderBy("activity_log.date", "DESC")
            .getRawMany()
        return await data as [];
    }

    async getLogsById(id: number): Promise<[]> {
        const data = await getRepository(ActivityLog)
        .createQueryBuilder("activity_log")
        .leftJoin(ActivityList, "ali", "activity_log.activity_id = ali.id")
        .select("activity_log.id, ali.name, activity_log.time, activity_log.date")
        .where("activity_log.activityId = :id", { id })
        .orderBy("activity_log.date", "DESC")
        .getRawMany()
    return await data as [];
    }

    async postActivityLog(postData: ActivityLogDto): Promise<ActivityLog> {
        const activityLog: ActivityLog = new ActivityLog();
        activityLog.activityId = postData.activityId;
        activityLog.time = postData.time;
        // activityLog.date = currentDateUTC();
        // utc date seems to be returning date from 2 hours ago, rather than 1 hour ago
        // activityLog.date = new Date();
        //  update api at future date to allow date to be optionally added - e.g. if backtracking activities 
        return this.activityLogRepository.save(activityLog);
    }
}