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
    
    async calculateStreak(logs: ActivityLog[], activityId: number) {
        let count = 0;
        let streakStartDate = logs[logs.length - 1].date; // set start date to be last item in array/furthest date away by default

        logs.forEach((item, index) => {
            // calculate number of ms between current date + n/ith date 
            const ms = new Date().setUTCHours(0,0,0,0) - new Date(item.date).setUTCHours(0,0,0,0);
            // if it is equal to n/i * 86400000 (e.g. if it's equal to 1...2...n days ago), increment count 
            if (ms === index * 86400000) {
                count++ 
            } else {
                // if the day did not meet the condition, then get the date of the last day that did
                if (index != 0 && streakStartDate === logs[logs.length - 1].date) {   // if this isn't first item in array & startdate hasn't been reset yet - this ensure it only gets reset once. Start date will be last date that met the condition of if statement
                    streakStartDate = logs[index - 1].date;
                }
            }
        });

        const formattedStartDate = moment(streakStartDate).format("YYYY-MM-DD");
        
        // add streak to streak table
        if (count > 1) {
            // check if streak is already in the streak table
            const streakExists = await this.getStreakByStartDate(activityId, formattedStartDate);
            if (streakExists === undefined) {
                // post if streak does not exist 
               await this.postStreak(activityId, count, formattedStartDate);
            } else {
                // update - if start date for this activity is already in streak table, update count & end date
                await this.updateStreak(streakExists, count);
            }
        }
        return count;
    }

    async getCurrentStreak(id: number): Promise<Streak> {
        const formattedDate = moment(new Date()).format("YYYY-MM-DD");
        const todaysStreak = await this.streakRepository.findOne({ where : { activityId: id, endDate: formattedDate }});
        const now = new Date();
        const endOfDay = new Date()
        endOfDay.setHours(23,59,59,999);

        // if there is no record from today (yet) & time now < 23:59:59, then look for one from previous day
        if (todaysStreak === undefined && now < endOfDay) {
            const yesterday = moment(moment(new Date()).format("YYYY-MM-DD")).subtract(1, 'day').format("YYYY-MM-DD");
            return await this.streakRepository.findOne({ where : { activityId: id, endDate: yesterday }});
        }
        // else, return todays record 
        return todaysStreak;
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

}
