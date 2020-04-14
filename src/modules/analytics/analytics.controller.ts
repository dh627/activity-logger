import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';
import moment = require("moment");

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
        for (let i = 0; i < logs.length; i++) {
            console.log(logs[i].date);
            const currentDate = moment(logs[i].date).format("L");
        }

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
