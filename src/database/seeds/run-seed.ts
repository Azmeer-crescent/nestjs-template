import { AppDataSource } from '../../config/typeorm.datasource';
import { RoleSeeder } from '../../auth/seeders/role.seeder';
import { UserSeeder } from '../../user/seeders/user.seeder';
import { Role } from '../../auth/entities/role.entity';
import { User } from '../../user/entities/user.entity';

async function runSeed() {
  try {
    console.log('Running seeds...');
    await AppDataSource.initialize();

    const roleRepo = AppDataSource.getRepository(Role);
    const userRepo = AppDataSource.getRepository(User);

    const roleSeeder = new RoleSeeder(roleRepo);
    await roleSeeder.seed();

    const userSeeder = new UserSeeder(userRepo, roleRepo);
    await userSeeder.run();


    console.log('Seeds completed successfully');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
}

runSeed();