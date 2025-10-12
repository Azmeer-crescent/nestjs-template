import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepo: Repository<Book>,
        @InjectRepository(Author)
        private readonly authorRepo: Repository<Author>,
    ) { }

    async create(dto: CreateBookDto) {
        const author = await this.authorRepo.findOneBy({ id: dto.authorId });
        if (!author) throw new NotFoundException('Author not found');

        const book = this.bookRepo.create({
            ...dto,
            author,
        });

        return this.bookRepo.save(book);
    }

    // Pagination added
    // Filter by authorId added
    async findAll(page = 1, limit = 10, authorId?: number) {
        const query = this.bookRepo.createQueryBuilder('book');

        if (authorId) {
            query.where('book.authorId = :authorId', { authorId });
        }

        query.skip((page - 1) * limit).take(limit).orderBy('book.id', 'ASC');

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }



    async findOne(id: number) {
        return this.bookRepo.findOneBy({ id });
    }

    async update(id: number, dto: UpdateBookDto) {
        const book = await this.bookRepo.findOneBy({ id });
        if (!book) throw new NotFoundException('Book not found');
        Object.assign(book, dto);
        return this.bookRepo.save(book);
    }

    async remove(id: number) {
        const book = await this.bookRepo.findOneBy({ id });
        if (!book) throw new NotFoundException('Book not found');
        return this.bookRepo.remove(book);
    }
}
