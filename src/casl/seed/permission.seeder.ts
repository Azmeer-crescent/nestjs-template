// src/seeds/permission.seeder.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { Repository } from 'typeorm';
import { CsvSeederService } from 'src/common/services/csv-seeder.service';
import { PermissionCsvDto } from '../dto/permission-csv.dto';

@Injectable()
export class PermissionSeeder {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
        private readonly csvSeeder: CsvSeederService<Permission>
    ) { }

    async seedFromCSV(): Promise<void> {
        await this.csvSeeder.seedFromCsv(
            this.permissionRepo,
            'src/casl/seed/permissions.csv',
            PermissionCsvDto,
            (row) => !!row.action && !!row.subject
        );
    }
}
