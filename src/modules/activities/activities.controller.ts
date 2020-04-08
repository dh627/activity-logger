import { Controller, Get, ParseIntPipe, Param, NotFoundException, Delete, BadRequestException, Post, Body, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivityList } from 'src/entities/activity-list.entity';
import { DeleteResult } from 'typeorm';
import { ActivityListDto } from './dto/activity-list.dto';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { ActivityLogDto } from './dto/activity-log.dto';
import { GenericDateDto } from 'src/dto/generic-date.dto';

@Controller('activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) {}
    // GET all logs
    @Get("/alllogs")
    async getAllLogs(@Query() genericDateDto: GenericDateDto): Promise<[]> {
        return await this.activitiesService.getAllLogs(genericDateDto);
    }

    // GET all Activities
    @Get("")
    async findAll(): Promise<ActivityList[]> {
        return await this.activitiesService.findAll();
    }

    // GET Activity by ID
    @Get("/:id")
    async findActivity(@Param("id", new ParseIntPipe()) id: number): Promise<ActivityList> {
        const activity = await this.activitiesService.findActivity(id);
        if (activity === undefined) {
            throw new NotFoundException("invalid-activity-id-given");
        }
        return activity;
    }

    // POST Activity
    @Post("")
    @UsePipes(ValidationPipe)
    async postActivity(@Body() activityListDto: ActivityListDto): Promise<ActivityList> {
        // this has a unique key on the name, so do a search to check that the activity
        // does not already exist (check by name & username)
      return await this.activitiesService.postActivity(activityListDto);  
    }

    // PUT Activity

    // DELETE Activity 
    @Delete("/:id")
    async deleteActivity(@Param("id", new ParseIntPipe()) id: number): Promise<DeleteResult> {
        const activity = await this.activitiesService.findActivity(id);
        if (activity === undefined) {
            throw new BadRequestException("invalid-activity-id-given");
        }
        // perhaps also delete all records in activity_log table that reference the id being deleted.
        // or perhaps just disable activity instead? So that activity logs can still be seen for this activity 
        return await this.activitiesService.deleteActivity(activity.id);
    }

    // // GET all logs
    // @Get("/alllogs")
    // async getAllLogs(@Query() genericDateDto: GenericDateDto): Promise<unknown> {
    //     return await this.activitiesService.getAllLogs(genericDateDto);
    // }

    // GET logs in DESC 
        // maybe call getAllLogs() as above, and then sort them with JS

    // GET logs in date range
        // most recent by default 

    // GET logs ordered by activity 
        // or maybe build this into the get all logs activity by having a 'sort' option, 
        // where sort is a query param that can be set to true or something.
        // Or maybe call getAllLogs() as above, and then sort them with JS

    // GET all logs for specific activity 
    @Get("log/:id")
    async getLogsById(
        @Param("id", new ParseIntPipe()) id: number,
        @Query() genericDateDto: GenericDateDto
        ): Promise<[]> {
        const activity = await this.activitiesService.findActivity(id);
        if (activity === undefined) {
            throw new BadRequestException("invalid-activity-id-given");
        }
        return await this.activitiesService.getLogsById(activity.id, genericDateDto);
    }

    // Get Activity Log by ID
    // make the service a join instead?
    @Get("activitylog/:id")
    async findActivityLog(@Param("id", new ParseIntPipe()) id: number) {
        const activityLog = await this.activitiesService.findActivityLog(id);

        if (activityLog === undefined) {
            throw new NotFoundException("invalid-activity-id-given");
        }

        return activityLog;
    }

    // POST Activity Log
    @Post("activitylog")
    async postActivityLog(@Body() activityLogDto: ActivityLogDto): Promise<ActivityLog> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const activity = await this.findActivity(activityLogDto.activityId);
        return await this.activitiesService.postActivityLog(activityLogDto);
    }

    // PUT Activity Log

    // Delete Activity Log
    @Delete("log/:id")
    async deleteActivityLog(@Param("id", new ParseIntPipe()) id: number): Promise<DeleteResult> {
        const activity = await this.activitiesService.findActivityLog(id);
        return await this.activitiesService.deleteActivityLog(activity.id);
    }
}
