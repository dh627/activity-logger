import { Controller, Get, ParseIntPipe, Param, NotFoundException, Delete, BadRequestException, Post, Body, UsePipes, ValidationPipe, Query, Put } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivityList } from 'src/entities/activity-list.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ActivityListDto } from './dto/activity-list.dto';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { ActivityLogDto } from './dto/activity-log.dto';
import { GenericDateDto } from 'src/dto/generic-date.dto';
import { AnalyticsService } from 'src/modules/analytics/analytics.service';

@Controller('activities')
export class ActivitiesController {
    constructor(
        private readonly activitiesService: ActivitiesService,
        private readonly analyticsService: AnalyticsService
    ) {}
    // GET all activity logs
    @Get("/alllogs")
    // type should be | undefined?
    async getAllLogs(@Query() genericDateDto: GenericDateDto): Promise<[]> {
        return await this.activitiesService.getAllLogs(genericDateDto);
    }
    
    // GET all activities 
    @Get("/allactivities")
    async findAll(): Promise<ActivityList[]> {
        return await this.activitiesService.findAll();
    }

    @Get("/enabledactivities")
    async findEnabledActivities() {
       return await this.activitiesService.findEnabledActivities();
    }

    // Enable/Disable activity 
    // do when doing front end

    // GET activity by ID
    @Get("/:id")
    async findActivity(@Param("id", new ParseIntPipe()) id: number): Promise<ActivityList> {
        const activity = await this.activitiesService.findActivity(id);
        if (activity === undefined) {
            throw new NotFoundException("invalid-activity-id-given");
        }
        return activity;
    }

    // POST activity
    @Post("postactivity")
    @UsePipes(ValidationPipe)
    async postActivity(@Body() activityListDto: ActivityListDto): Promise<ActivityList> {
        // this has a unique key on the name, so do a search to check that the activity
        // does not already exist (check by name & username)
      return await this.activitiesService.postActivity(activityListDto);  
    }

    // add a disable activity controller.
    // make it a put request 

    // PUT activity
    @Put("updateactivity/:id")
    async updateActivity(
        @Param("id", new ParseIntPipe()) id: number,
        @Body() updateActivityData: ActivityListDto
        ): Promise<UpdateResult> {
        const activity = await this.activitiesService.findActivity(id);
        if (activity === undefined) {
            throw new BadRequestException("invalid-activity-id-given")
        }
        return await this.activitiesService.updateActivity(activity, updateActivityData)
    }

    // DELETE activity
    @Delete("/:id")
    async deleteActivity(@Param("id", new ParseIntPipe()) id: number): Promise<DeleteResult> {
        const activity = await this.activitiesService.findActivity(id);
        if (activity === undefined) {
            throw new BadRequestException("invalid-activity-id-given");
        }
        return await this.activitiesService.deleteActivity(activity.id);
    }

    // GET specific activity
    @Get("activitylog/:id")
    async findActivityLog(@Param("id", new ParseIntPipe()) id: number) {
        const activityLog = await this.activitiesService.findActivityLog(id);

        if (activityLog === undefined) {
            throw new NotFoundException("invalid-activity-id-given");
        }

        return activityLog;
    }

    // GET all logs of a specific activity
    @Get("logs/:id")
    async getLogsById(
        @Param("id", new ParseIntPipe()) id: number,
        @Query() genericDateDto: GenericDateDto
        ) {
        const activity = await this.activitiesService.findActivity(id);
        if (activity === undefined) {
            throw new BadRequestException("invalid-activity-id-given");
        }
        return await this.activitiesService.getLogsById(activity.id, genericDateDto);
    }

    // POST activity log
    @Post("activitylog")
    async postActivityLog(@Body() activityLogDto: ActivityLogDto): Promise<ActivityLog> {
        // make it so that you can only post one activity per activity a day - so check date doesnt already exist
        const activity = await this.activitiesService.findActivity(activityLogDto.activityId);
        if (activity === undefined) {
            throw new BadRequestException("invalid-activity-id-given");
        }
        const activityLog = await this.activitiesService.postActivityLog(activityLogDto);

        const logs = await this.activitiesService.getLogsById(activity.id, undefined);

        if (logs.length === 1) {
            return activityLog;
        }

        await this.analyticsService.calculateStreak(logs, activity.id);

        return activityLog;
    }

    // PUT activity log
    @Put("updateactivitylog/:id")
    async updateActivityLog(
        @Param("id", new ParseIntPipe()) id: number,
        @Body() updateActivityLogData: ActivityLogDto
    ) {
        const activityLog = await this.activitiesService.findActivityLog(id);
        if (activityLog === undefined) {
            throw new BadRequestException("invalid-activity-log-id-given");
        }
        return await this.activitiesService.updateActivityLog(activityLog, updateActivityLogData);
    }

    // DELETE activity log
    @Delete("log/:id")
    async deleteActivityLog(@Param("id", new ParseIntPipe()) id: number): Promise<DeleteResult> {
        const activity = await this.activitiesService.findActivityLog(id);
        if (activity === undefined) {
            throw new BadRequestException("invalid-activity-log-id-given");
        }
        return await this.activitiesService.deleteActivityLog(activity.id);
    }
}

    // GET logs ordered by activity 
        // or maybe build this into the get all logs activity by having a 'sort' option, 
        // where sort is a query param that can be set to true or something.
        // Or maybe call getAllLogs() as above, and then sort them with JS