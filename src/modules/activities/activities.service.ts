import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityList } from 'src/entities/activity-list.entity';
import { Repository, DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { ActivityListDto } from './dto/activity-list.dto';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { ActivityLogDto } from './dto/activity-log.dto';
import { GenericDateDto } from 'src/dto/generic-date.dto';
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

    async postActivity(postData: ActivityListDto): Promise<ActivityList> {
        const activity: ActivityList = new ActivityList();
        activity.name = postData.name;
        activity.dateAdded = new Date();
        return this.activityListRepository.save(activity);
    }

    async updateActivity(activity: ActivityList, updateActivityData: ActivityListDto): Promise<UpdateResult> {
        activity.name = updateActivityData.name;
        return await this.activityListRepository.update(activity.id, activity);
    }

    async deleteActivity(id: number): Promise<DeleteResult> {
        return await this.activityListRepository.delete(id);
    }

    async getAllLogs(genericDateDto: GenericDateDto): Promise<[]> {

        const query = getRepository(ActivityLog)
        .createQueryBuilder("activity_log")
        .leftJoin(ActivityList, "ali", "activity_log.activity_id = ali.id")
        .select("activity_log.id, ali.name, activity_log.time, activity_log.date")
        .orderBy("activity_log.date", "DESC")

        if (genericDateDto.dateFrom && genericDateDto.dateTo) {
            const dateFrom = genericDateDto.dateFrom + " 00:00:00";
            const dateTo = genericDateDto.dateTo + " 23:59:59";
            query.where("date BETWEEN :dateFrom AND :dateTo", { dateFrom, dateTo })

        }
        return (await query.getRawMany()) as [];
    }

    async getLogsById(id: number, genericDateDto: GenericDateDto) {

        const query = await getRepository(ActivityLog)
        .createQueryBuilder("activity_log")
        .leftJoin(ActivityList, "ali", "activity_log.activity_id = ali.id")
        .select("activity_log.id, ali.name, activity_log.time, activity_log.date")
        .orderBy("activity_log.date", "DESC")

        if (genericDateDto !== undefined && genericDateDto.dateFrom && genericDateDto.dateTo) {
            const dateFrom = genericDateDto.dateFrom + " 00:00:00";
            const dateTo = genericDateDto.dateTo + " 23:59:59";
            query.where("activity_log.activityId = :id AND date BETWEEN :dateFrom AND :dateTo", { id, dateFrom, dateTo });
        } else {
            query.where("activity_log.activityId = :id", { id })
        }

        return (await query.getRawMany());
        // add type, remember that returning data as [] caused problems - perhaps define a model
        // of what this data should look like 
    }

    // make join instead?
    async findActivityLog(id: number) {
        const query = await getRepository(ActivityLog)
        .createQueryBuilder("activity_log")
        .leftJoin(ActivityList, "ali", "activity_log.activity_id = ali.id")
        .select("activity_log.id, activity_log.activity_id, ali.name, activity_log.time, activity_log.date")
        .where("activity_log.id = :id", { id})
        .getRawOne()
        return query; 
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

    async updateActivityLog(activityLog: ActivityLog, updateLogData: ActivityLogDto) {
        // note - can enter an invalid activityId here, maybe make it call a service to ensure it's valid
        // - though on the front end i guess it'll be a drop down list of activities 
        // possibly amend this api so that only time can be updated - date and activity id should always
        // be right 
        activityLog.activityId = updateLogData.activityId;
        activityLog.time = updateLogData.time;
        activityLog.date = updateLogData.date;
        return this.activityLogRepository.update(activityLog.id, activityLog);
    }

    async deleteActivityLog(id: number): Promise<DeleteResult> {
        return await this.activityLogRepository.delete(id);
    }
}