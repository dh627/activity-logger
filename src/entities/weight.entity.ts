import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Weight {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;

    @Column("int", {
        name: "stone",
        nullable: false
    })
    stone: number;

    @Column("double", {
        name: "pounds",
        nullable: false
    })
    pounds: number;

    @Column("date", {
        nullable: false,
        name: "date"
    })
    date: string;
}