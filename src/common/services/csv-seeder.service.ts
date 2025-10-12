import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
const csv = require('csv-parser');
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CsvSeederService<T extends Record<string, any>> {
  async seedFromCsv<TDto extends object>(
    repo: Repository<T>,
    csvPath: string,
    dtoClass: new () => TDto,
    validateRow?: (row: any) => boolean
  ): Promise<void> {
    const fullPath = path.resolve(csvPath);
    const rawRows: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(fullPath)
        .pipe(csv())
        .on('data', (row) => {
          if (validateRow && !validateRow(row)) {
            console.warn('⚠️ Skipping invalid row:', row);
            return;
          }
          rawRows.push(row);
        })
        .on('end', async () => {
          const dtos = plainToInstance(dtoClass, rawRows, {
            excludeExtraneousValues: true,
          });

          const validEntities: T[] = [];
          const errors: { row: number; issues: string[] }[] = [];

          for (let i = 0; i < dtos.length; i++) {
            const dto = dtos[i];
            const validationErrors = await validate(dto);

            if (validationErrors.length === 0) {
              const entity = repo.create(dto as unknown as T);
              validEntities.push(entity);
            } else {
              errors.push({
                row: i + 1,
                issues: validationErrors.flatMap(err => Object.values(err.constraints || {})),
              });
            }
          }

          if (validEntities.length > 0) {
            await repo.save(validEntities);
            console.log(`✅ Seeded ${validEntities.length} records from ${path.basename(csvPath)}`);
          }

          if (errors.length > 0) {
            console.warn(`⚠️ Validation errors in ${errors.length} rows:`);
            errors.forEach(err =>
              console.warn(`Row ${err.row}: ${err.issues.join('; ')}`)
            );
          }

          resolve();
        })
        .on('error', reject);
    });
  }
}
