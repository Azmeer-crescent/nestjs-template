// /database/seed/run-seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module'; 
import { CountrySeederService } from '../../country/seed/country-seeder.service';
import { RoleSeeder } from '../../casl/seed/role.seeder';
import { PermissionSeeder } from '../../casl/seed/permission.seeder';
import { RolePermissionSeeder } from '../../casl/seed/role-permission.seeder';
import { UserSeeder } from '../../casl/seed/user.seeder';

async function run() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  // Country seeding
  const countrySeeder = appContext.get(CountrySeederService);
  await countrySeeder.seedFromCSV();
  console.log('✅ Country seeding complete');

  // CASL seeding
  const roleSeeder = appContext.get(RoleSeeder);
  const permissionSeeder = appContext.get(PermissionSeeder);
  const rolePermissionSeeder = appContext.get(RolePermissionSeeder);
  const userSeeder = appContext.get(UserSeeder);

  await roleSeeder.seed?.();
  await permissionSeeder.seedFromCSV?.();
  await rolePermissionSeeder.seed?.();
  await userSeeder.seed?.();
  console.log('✅ CASL seeding complete');

  await appContext.close();

}

run().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});












