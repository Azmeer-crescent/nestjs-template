import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { CountrySeederService } from './seed/country-seeder.service';
import { CommonModule } from 'src/common/common.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    CacheModule.register(),
    CommonModule
  ],
  controllers: [CountryController],
  providers: [CountryService, CountrySeederService],
  exports: [],
})
export class CountryModule { }
