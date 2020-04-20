import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { ActivityLog } from 'src/entities/activity-log.entity';
import * as moment from "moment";
import { Streak } from 'src/entities/streak.entity';
@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(ActivityLog) private readonly activityLogRepository: Repository<ActivityLog>,
        @InjectRepository(Streak) private readonly streakRepository: Repository<Streak>
    ){}
    
    // need to ensure that this gets called once a day (at end of day) to ensure that streaks get posted to the database 
    async calculateStreak(logs: ActivityLog[], activityId: number) {
        let count = 0;
        let streakStartDate = logs[logs.length - 1].date; // set start date to be last item in array/furthest date away

        logs.forEach((item, index) => {
            // calculate number of ms between current date + n/ith date 
            const ms = new Date().setUTCHours(0,0,0,0) - new Date(item.date).setUTCHours(0,0,0,0);
            // if it is equal to n/i * 86400000 (e.g. if it's equal to 1...2...n days ago), increment count 
            if (ms === index * 86400000) {
                count++ 
            } else {
                // if the day did not meet the condition, then get the date of the last day that did
                if (index != 0 && streakStartDate === logs[logs.length - 1].date) {   // if this isn't first item in array & startdate hasn't been reset yet - this ensure it only gets reset once
                    streakStartDate = logs[index - 1].date;
                }
            }
        });

        const formattedStartDate = moment(streakStartDate).format("YYYY-MM-DD");
        
        // add streak to streak table
        if (count > 1) {
                // check if streak is already in the streak table
                const streakExists = await this.getStreakByStartDate(activityId, formattedStartDate);
                // if the start date for this activity is already in the streak table (so find by activity id & start date), update the end date
                // else, post the start date (post as a string, maybe format with moment) + current date (format)
                if (streakExists === undefined) {
                    // post 
                    await this.postStreak(activityId, count, formattedStartDate);
                } else {
                    // update 
                    await this.updateStreak(streakExists, count);
                }
        }
        return count;

        // I could optimise this so that it begins by checking whether a streak exists or not that has an end date of the day before (convert string date into date & set utc and then take it away from current date & see if it equals 1day in ms)
        // if it is undefined - then I need to post one - and need to do the streak calculation
        // if a streak does exist, and the end date is yesterday, then I don't need to do the calculation, but simply need to 
        // increment the count by 1
        // This could be more efficient, as at the moment, it is running the calculation every time. 
    }

    async getCurrentStreak(id: number): Promise<Streak> {
        const formattedDate = moment(new Date()).format("YYYY-MM-DD");
        return await this.streakRepository.findOne({ where : { activityId: id, endDate: formattedDate }});
    }

    async getTopStreaks(id: number): Promise<[]> {
        // not sure why i'm having to specify aliases for column names, they're returning in snake case otherwise (my other querybuilders dont?)
        const query = await getRepository(Streak)
        .createQueryBuilder("streak")
        .select("streak.startDate as startDate, streak.endDate as endDate, streak.count")
        .where("streak.activityId = :id", { id })
        .orderBy("count", "DESC")
        .limit(10)
        .getRawMany()
        return query as [];
    }

    private async getStreakByStartDate(activityId: number, startDate: string) {
        return this.streakRepository.findOne({ where: { activityId, startDate } });
    }

    private async postStreak(activityId, count, startDate) {
        const streak: Streak = new Streak()
        streak.activityId = activityId;
        streak.count = count;
        streak.startDate = startDate;
        streak.endDate = moment(new Date()).format("YYYY-MM-DD");
        return this.streakRepository.save(streak);
    }

    private async updateStreak(streak: Streak, count) {
        streak.count = count;
        streak.endDate = moment(new Date()).format("YYYY-MM-DD");
        return await this.streakRepository.update(streak.id, streak);
    }

    // Cron job
        // for each activity, run the calculate streak method at about 23:55 pm 
        // will need to get a list of each activity 
        // will then need to get logs of activity for each activity 
        // will then need to run the calculate streak function for each activity 
        // not sure if I need cron job any more, as when user adds activity it should add to streak, so should
        // catch everything. 

        // what about when I have usernames attached? How will it work if it involves usernames etc?
        // may have to split some of the calculateStreak function out into independent functions
        // and then have one main function that calls particular functions based on whether it is a
        // cron job or user requested job. 
}
