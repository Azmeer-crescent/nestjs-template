import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>
  ) {}

  async create(dto: CreateAuthorDto) {
    const author = this.authorRepo.create(dto);
    return this.authorRepo.save(author);
  }

  async findAll() {
    return this.authorRepo.find();
  }

  async findOne(id: number) {
    return this.authorRepo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateAuthorDto) {
    const author = await this.authorRepo.findOneBy({ id });
    if (!author) throw new NotFoundException('Author not found');
    Object.assign(author, dto);
    return this.authorRepo.save(author);
  }

  async remove(id: number) {
    const author = await this.authorRepo.findOneBy({ id });
    if (!author) throw new NotFoundException('Author not found');
    return this.authorRepo.remove(author);
  }
}
