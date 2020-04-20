import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';
import { AnalyticsService } from './analytics.service';
import { Streak } from 'src/entities/streak.entity';

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
    async getCurrentStreak(@Param("id", new ParseIntPipe()) id: number): Promise<Streak | number> {
        // also check that activity exists
        if (await this.activitiesService.findActivity(id) === undefined) {
            throw new NotFoundException("invalid-activity-id-given");
        }

        const logs = await this.activitiesService.getLogsById(id, undefined);
        
        if (logs === undefined) {
            throw new NotFoundException("No logs available for this activity");
        }

        // if there is only one activity log, and that activity log is from today, return streak as 1
        if (logs.length === 1 && logs[0].date.setUTCHours(0,0,0,0) === new Date().setUTCHours(0,0,0,0)) {    
            return 1;
        }

        const count = await this.analyticsService.getCurrentStreak(id);

        // maybe amend somehow so that if you haven't added logs for today (but did for yesterday), it doesn't just show as 0.
        if (count === undefined) {
            return 0
        }

        return count;

        // no longer want to call this from here - instead query the DB. The below gets called when new activity created
        // return await this.analyticsService.calculateStreak(logs, id);
    }

    @Get("topstreaks/:id")
    async getTopStreaks(@Param("id", new ParseIntPipe()) id: number): Promise<[]> {
        // perhaps on front end make a note to say that only > 1 day will appear as a streak.
        return await this.analyticsService.getTopStreaks(id);
    }
}

// Will need to think about what happens if I delete a log - what happens to the streak?
// Perhaps if a log is deleted then clears all the streaks & runs it again the formula part of the streak)/or the streak it belongs to - 
// though my streak only works for 'current' streaks. When there is a break in the streak, we need to 
// calculate the streak from the day that broke it - until we get to the end of the activity log for that activity. 