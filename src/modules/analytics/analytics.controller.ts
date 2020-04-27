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

    // this method previously calculated the streak, however now it just gets from the database instead, getting the streak
    // where the current date equals the end date 
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
            return 1; // note this returns just a number, whereas count returns an entity. Perhaps also return the date with this too
            // so that it's easier for the frontend 
        }

        const count = await this.analyticsService.getCurrentStreak(id);

        // maybe amend somehow so that if you haven't added logs for today (but did for yesterday), it doesn't just show as 0.
        // perhaps if time is before 23:59:59 & there is a streak that ended in the DB as yesterday, then show that count
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

// Perhaps loop through every date, as soon as the streak ends, post the streak, grabbing its start/end date.
// then, continue going through the array (for subsequent streaks, instead of going from the current date, go from the day that the 
// streak started & then go from next date in array)
// May need pen and paper for this...write out dates

// 2020-04-10
// 2020-04-09 -- break
// 2020-04-07 -- start looking from next date in array

// When I delete an activity, I want to find the date of the activity, then find the streak that it belongs to, then re-run
// a streak calculator that now creates two different streaks between those two dates. So streak one would be from original start
// date to day before streak break date, and the second one would be from day after streak break date to the original end date.
// Needs to be able to handle multiple & quick deletions...
// Ultimately - I want two functions, a calculateStreak function, and a recalculateStreak function - which is called from
// the delete activity log controller - it will get the streak that the log belongs to, then pass it to the recalculate streak
// function

// Remember to optimise the current calculateStreak function.

// ideally, i want some method that can take in two dates and calculate all of the streaks within those two dates. E.g.
// two dates could be between first log and current date, or two entirely custom dates - e.g. 10th jan 2020 and 14 apr 2020
// actually - i think I can just do this by searching what I currently have by passing in two dates.

