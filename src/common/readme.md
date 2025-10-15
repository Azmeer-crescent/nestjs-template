### Using `common` module (x=your new module)
- This is needed if you are planning to use the CSV import or type-ahead services
- Study the `country` module to understand the sample code
- import 'CommonModule' to your x.module.ts import section:
```
//x.module.ts

import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
```
### Using CSV import service
- Create `/dto/x-csv.dto.ts`
- Create `/seed/x.csv`
- Create `/seed/x-seeder.service.ts`
- This requires 4 parameters:
  - Factory/Repository
  - Path the CSV file
  - DTO file
  - Row headers
- Add seeder to master seeder: `/database/run-seed.ts`
- Add seeder service as a `provider` to `x.module.ts`
```
//x.module.ts

import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [XSeederService],
```
### Using type-ahead service
- Add `lookAhead()` method to x.controller.ts
- Add `lookAhead()` method to x.service.ts