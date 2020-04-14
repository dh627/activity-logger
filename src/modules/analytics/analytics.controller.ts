import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';
import moment = require("moment");
import { AdvancedConsoleLogger } from 'typeorm';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly activitiesService: ActivitiesService) {}

    @Get("currentstreak/:id")
    async getCurrentStreak(@Param("id", new ParseIntPipe()) id: number) {
        const logs = await this.activitiesService.getLogsById(id, undefined);
        
        if (logs === undefined) {
            throw new NotFoundException("No logs available for this activity");
        }

        let streak = 0;
        console.log("LOGS LENGTH", logs.length);

        // if (logs.length === 1) {
        //     streak = 1;
        // } else (do for loop)

        // maybe prevent array from running if it's not more than 1?
        // this is currently not counting streak = 1 when there is only one consecutive day 
        // if i === 0, then add to streak? 
        // I also think that if you have a secondary streak (i.e. one that doesnt make it to the end of the array) then it is missing a day from its count?
        // - unless I do i === 0 - but then this messes up the count if it does reach the end of the array? Perhaps
        for (let i = 0; i < logs.length; i++) {
            const currentDate = logs[i].date;
            if (i !== logs.length - 1) {
                if (i === 0) streak+=1;
                // if logs.length < 2 break 
                const nextDate = logs[i + 1].date;  // will only work if array is > 1 
                console.log("CURRENT DATE: ", currentDate, "NEXT DATE: ", nextDate);
                const add = moment(nextDate).add(1, 'day').format("YYYY-MM-DD");
                console.log("ADD DATE", add);
    
                if (add === moment(currentDate).format("YYYY-MM-DD")) {
                    streak+=1;
                } else {   // exit for loop if next day in loop is not consecutive day
                    break;
                }
            } else {    // if streak goes all the way to the end of array, check that last item is a consecutive day(as i + 1 won't work if it's last element in array)
                const previousDate = logs[i - 1].date;
                const subtract = moment(previousDate).subtract(1, 'day').format('YYYY-MM-DD');
                if (subtract === moment(currentDate).format("YYYY-MM-DD")) {
                    streak +=1;
                }
            }
        }
        // issues - my 29 day current streak is showing as 30, as it counts when i===0 and since it goes to the end of the array it adds one there too

        // check if this is the current highest streak. If it is, set it to the new highest (& try and include the dates)

        console.log("STREAK", streak);
        return streak;

        // considerations/edge cases:
          // if array is only 1
          // if there is a non consecutive day before the end of the array (which there will be)

        // loop through logs
            // convert each date to yyyy-mm-dd
            // if current loop date === current loop date i+1 - a day, add to count
                // else return count
                //  let streak = 0; 
        
    // note - the getLogsById was original set to return type Promise<[]> and
    // the return section of that method was saying getRawMany() as []
    // However, this was causing issues, it was saying Property 'date' (log.date) does not exist on type 'never' in find function
    // see here https://stackoverflow.com/questions/53456236/property-id-does-not-exist-on-type-never-in-find-function
    }
}
