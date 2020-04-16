import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(
        private readonly activitiesService: ActivitiesService,
        private readonly analyticsService: AnalyticsService
        ) {}

    @Get("currentstreak/:id")
    // now that posting an activity log calls calculateStreak, I could perhaps
    // make the 'current streak' api just a call to the streak table that gets the 
    // streak where the current date equals the end date 
    // if an activity log doesn't exist, then streak will be 0. E.g. if you've just added an activity
    // but haven't made a log yet 
    // however when I change all this I need to ensure that when current streak = 1 is still covered, as
    // a count of 1 isn't actually added to the db  
    async getStreak(@Param("id", new ParseIntPipe()) id: number) {
        const logs = await this.activitiesService.getLogsById(id, undefined);
        
        if (logs === undefined) {
            throw new NotFoundException("No logs available for this activity");
        }

        if (logs.length === 1) {    // this is wrong - length needs to === 1 and the date of log[0].date needs to be today
            return 1;
        }

        return await this.analyticsService.calculateStreak(logs, id);
    }
}
