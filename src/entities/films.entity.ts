import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Films {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;

    @Column("varchar", {
        nullable: false,
        name: "title"
    })
    title: string;

    @Column("int", {
        nullable: true,
        name: "rating"
    })
    rating: number;

    @Column("date", {
        nullable: false,
        name: "date"
    })
    date: Date;
}