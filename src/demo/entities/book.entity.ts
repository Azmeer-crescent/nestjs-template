/**
 * @ManyToOne on Book side, @OneToMany on Author side. 
 * ie: One author can have many books. One book has one author.
 * eager: true auto-loads author when fetching books.
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Author } from '../entities/author.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  publishedYear: number;

  @Column({ nullable: true })
  genre?: string;

  @ManyToOne(() => Author, author => author.books, { eager: true })
  author: Author;
}
