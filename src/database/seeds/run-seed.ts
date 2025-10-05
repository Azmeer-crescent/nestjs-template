import { AppDataSource } from '../../config/typeorm.datasource';
// import { UserSeeder } from './user.seeder';

async function runSeed() {
  try {
    await AppDataSource.initialize();
    
    console.log('Running seeds...');
    
    // const userSeeder = new UserSeeder(AppDataSource);
    // await userSeeder.run();
    
    console.log('Seeds completed successfully');
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
}

runSeed();