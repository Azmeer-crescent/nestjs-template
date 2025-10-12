// src/author/entities/author.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from '../entities/book.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nationality: string;

  @Column({ nullable: true })
  birthYear?: number;

  @OneToMany(() => Book, book => book.author)
  books: Book[];
}
