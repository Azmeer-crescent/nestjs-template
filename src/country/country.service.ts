import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CountryService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) { }

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const country = this.countryRepository.create(createCountryDto);
    return this.countryRepository.save(country);
  }

  async findAll(): Promise<Country[]> {
    const cacheKey = 'countries:all';
    const cached = await this.cacheManager.get<Country[]>(cacheKey);
    if (cached) return cached;

    const countries = await this.countryRepository.find({ order: { name: 'ASC' } });
    await this.cacheManager.set(cacheKey, countries, 3600); // cache for 1 hour
    return countries;
  }

  async findOne(id: number): Promise<Country> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }

  async update(id: number, updateCountryDto: UpdateCountryDto): Promise<Country> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    const updated = this.countryRepository.merge(country, updateCountryDto);
    await this.cacheManager.del('countries:all'); // Invalidate cache
    return this.countryRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const country = await this.countryRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    await this.countryRepository.remove(country);
    await this.cacheManager.del('countries:all'); // Invalidate cache
  }

  async lookAhead(query: string): Promise<Country[]> {
    return this.countryRepository.find({
      where: [
        { name: ILike(`%${query}%`) },
        { alpha2: ILike(`%${query}%`) },
        { code: ILike(`%${query}%`) },
      ],
      take: 10, // limit results
    });
  }
}
