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

    @Column("tinyint", {
        nullable: false,
        default: () => "'1'",
        name: "active"
        })
    active: boolean;
}