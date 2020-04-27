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
    async getCurrentStreak(@Param("id", new ParseIntPipe()) id: number): Promise<Streak | number> {
        if (await this.activitiesService.findActivity(id) === undefined) {
            throw new NotFoundException("invalid-activity-id-given");
        }

        const logs = await this.activitiesService.getLogsById(id, undefined);
        
        if (logs === undefined) {
            throw new NotFoundException("No logs available for this activity");
        }

        // if there is only one activity log, and that activity log is from today, return streak as 1
        if (logs.length === 1 && logs[0].date.setUTCHours(0,0,0,0) === new Date().setUTCHours(0,0,0,0)) {    
            return 1;  // returns just a number...make entity instead for front end?
        }

        const count = await this.analyticsService.getCurrentStreak(id);

        if (count === undefined) {
            return 0    // returns just a number...make entity instead for front end?
        }

        return count;
    }

    @Get("topstreaks/:id")
    async getTopStreaks(@Param("id", new ParseIntPipe()) id: number): Promise<[]> {
        // perhaps on front end make a note to say that only > 1 day will appear as a streak.
        return await this.analyticsService.getTopStreaks(id);
    }
}

