import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';
import { CountryCsvDto } from '../dto/country-csv.dto';
import { CsvSeederService } from '../../common/services/csv-seeder.service';

@Injectable()
export class CountrySeederService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    private readonly csvSeeder: CsvSeederService<Country>
  ) {}

  async seedFromCSV(): Promise<void> {
    await this.csvSeeder.seedFromCsv(
      this.countryRepo,
      'src/country/seed/countries.csv',
      CountryCsvDto,
      (row) => !!row.name && !!row.alpha2 && !!row.code
    );
  }
}
