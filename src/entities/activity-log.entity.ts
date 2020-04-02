import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ActivityLog {
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

    @Column("double", {
        name: "time",
        nullable: true
    })
    time: number | null;

    @Column("date", {
        name: "date",
        nullable: false
    })
    date: Date;
}