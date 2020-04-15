import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly activitiesService: ActivitiesService) {}

    @Get("currentstreak/:id")
    async getStreak(@Param("id", new ParseIntPipe()) id: number) {
        const logs = await this.activitiesService.getLogsById(id, undefined);
        
        if (logs === undefined) {
            throw new NotFoundException("No logs available for this activity");
        }

        let count = 0
        let streakStartDate;

        logs.forEach((item, index) => {
            // calculate number of ms between current date + n/ith date 
            const ms = new Date().setUTCHours(0,0,0,0) - new Date(item.date).setUTCHours(0,0,0,0);
            // if it is equal to n/i * 86400000 (e.g. if it's equal to 1...2...n days ago), increment count 
            if (ms === index * 86400000) {
                count++ 
            } else {
                // if the day did not meet the condition, then get the date of the last day that did
                if (streakStartDate === undefined) {
                    streakStartDate = logs[index - 1].date;
                }
            }
        });

        console.log("STREAK START DATE", streakStartDate);
        if (count > 1) {
            // add it to the streaks table. 
                // if the start date for this activity is already in the streak table (so find by activity id & start date), update the end date
                // else, post the start date (post as a string, maybe format with moment) + current date (format)
        }
        return count;
    }
}
