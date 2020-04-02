import { Controller, Get, ParseIntPipe, Param, NotFoundException, Delete, BadRequestException, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivityList } from 'src/entities/activity-list.entity';
import { DeleteResult } from 'typeorm';
import { ActivityListDto } from './dto/activity-list.dto';

@Controller('activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) {}
    // Get activities
    @Get()
    async findAll(): Promise<ActivityList[]> {
        return await this.activitiesService.findAll();
    }

    // Get activity by id
    @Get("/:id")
    async findActivity(@Param("id", new ParseIntPipe()) id: number): Promise<ActivityList> {
        const activity = await this.activitiesService.findActivity(id);
        if (activity === undefined) {
            throw new NotFoundException();
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
    @Post()
    @UsePipes(ValidationPipe)
    async postActivity(@Body() activityListDto: ActivityListDto): Promise<ActivityList> {
        // this has a unique key on the name, so do a search to check that the activity
        // does not already exist (check by name & username)
      return await this.activitiesService.postActivity(activityListDto);  
    }
    
    // @Get("log")
    // sort by date (most recent first) by default
    // sort by activity name & most recent if chosen - e.g. maybe 
    // have a 'sort' option, where sort is a query param that can be set to true or something.
    // allow a timeframe - optional date_from date_to query params. 
}
