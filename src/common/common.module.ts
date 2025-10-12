import { Module } from '@nestjs/common';
import { CsvSeederService } from './services/csv-seeder.service';

@Module({
    providers: [CsvSeederService],
    exports: [CsvSeederService],
})
export class CommonModule { }
