import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Moment } from "moment";

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

    @Column("timestamp", {
        name: "date",
        default: () => 'NOW()',
        nullable: false
    })
    date: string | Date;

}