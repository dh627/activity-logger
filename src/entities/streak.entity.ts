import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Streak {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;

    @Column("int", {
        nullable: false,
        name: "activity_id",
    })
    activityId: number;

    @Column("int", {
        nullable: false,
        name: "count"
    })
    count: number;

    @Column("date", {
        nullable: false,
        name: "start_date"
    })
    startDate: string;

    @Column("date", {
        nullable: false,
        name: "end_date",
    })
    endDate: string;
}