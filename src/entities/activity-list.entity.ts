import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()
@Unique(['name'])
export class ActivityList {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
        })
    id: number;

    @Column("varchar", {
        nullable: false,
        length: 100,
        name: "name"
    })
    name: string;

    @Column("date", {
        nullable: false,
        name: "date_added"
    })
    dateAdded: Date;
}