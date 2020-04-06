import { Controller, Get, ParseIntPipe, Param, NotFoundException, Delete, BadRequestException, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivityList } from 'src/entities/activity-list.entity';
import { DeleteResult } from 'typeorm';
import { ActivityListDto } from './dto/activity-list.dto';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { ActivityLogDto } from './dto/activity-log.dto';

@Controller('activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) {}
    @Post("activitylog")
    async postActivityLog(@Body() activityLogDto: ActivityLogDto): Promise<ActivityLog> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const activity = await this.findActivity(activityLogDto.activityId);
        return await this.activitiesService.postActivityLog(activityLogDto);
    }

    // this has been moved to the top as it was causing issues being further down for some reason
    @Get("/alllogs")
    async getAllLogs(): Promise<[]> {
        return await this.activitiesService.getAllLogs();
    }

    // Get activities
    @Get("")
    async findAll(): Promise<ActivityList[]> {
        return await this.activitiesService.findAll();
    }

    // Get activity by id
    @Get("/:id")
    async findActivity(@Param("id", new ParseIntPipe()) id: number): Promise<ActivityList> {
        const activity = await this.activitiesService.findActivity(id);
        if (activity === undefined) {
            throw new NotFoundException("invalid-activity-id-given");
        }
        return activity;
    }

    // Delete activity
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

    // Post Activity 
    @Post("")
    @UsePipes(ValidationPipe)
    async postActivity(@Body() activityListDto: ActivityListDto): Promise<ActivityList> {
        // this has a unique key on the name, so do a search to check that the activity
        // does not already exist (check by name & username)
      return await this.activitiesService.postActivity(activityListDto);  
    }

    // Put Activity 
    

    // get all logs
    // @Get("/alllogs")
    // async getAllLogs(): Promise<string> {
    //     return await this.activitiesService.getAllLogs();
    // }

    // get logs in date range
        // most recent by default 

    // get logs ordered by activity 
        // or maybe build this into the get all logs activity by having a 'sort' option, 
        // where sort is a query param that can be set to true or something.

    // get logs for specific activity 
    @Get("log/:id")
    async getLogsById(@Param("id", new ParseIntPipe()) id: number): Promise<[]> {
        // check activity exists
        const activity = await this.findActivity(id);
        return await this.activitiesService.getLogsById(activity.id);
    }

    // Delete Log
    @Delete("log/:id")
    async deleteActivityLog(@Param("id", new ParseIntPipe()) id: number) {
        const activity = await this.activitiesService.findActivityLog(id);
        return await this.activitiesService.deleteActivityLog(activity.id);
    }

    // Post Log

    // Delete Log 
}
