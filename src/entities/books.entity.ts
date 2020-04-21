import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BookStatus } from "src/modules/books/book-status.enum";

@Entity()
export class Books {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;

    @Column("varchar", {
        nullable: false,
        name: 'title'
    })
    title: string;

    @Column("varchar", {
        nullable: false,
        name: 'author'
    })
    author: string;

    @Column("varchar", {
        nullable: false,
        name: 'category'
    })
    category: string;

    @Column("varchar", {
        nullable: false,
        name: 'status'
    })
    status: BookStatus;

    @Column("int", {
        nullable: true,
        name: 'rating'
    })
    rating: number;

    @Column("date", {
    // make default empty string?
        nullable: true,
        name: 'start_date'
    })
    startDate: Date | string;

    @Column("date", {
        // make default empty string?
        nullable: true,
        name: 'end_date'
    })
    endDate: Date | string;
}