// src/user/seeders/user.seeder.ts
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../../auth/entities/role.entity';
import * as bcrypt from 'bcrypt';

interface SeedUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[]; // role names
}

export class UserSeeder {
  constructor(
    private readonly userRepo: Repository<User>,
    private readonly roleRepo: Repository<Role>,
  ) { }

  async run() {
    console.log('UserSeeder running...');
    const saltRounds = 10;
    const users: SeedUser[] = [
      { email: 'admin@example.com', password: 'admin123', firstName: 'Admin', lastName: 'User', roles: ['admin'] },
      { email: 'manager@example.com', password: 'manager123', firstName: 'Manager', lastName: 'User', roles: ['manager'] },
      { email: 'supervisor@example.com', password: 'supervisor123', firstName: 'Supervisor', lastName: 'User', roles: ['supervisor'] },
      { email: 'operator@example.com', password: 'operator123', firstName: 'Operator', lastName: 'User', roles: ['operator'] },
      { email: 'user@example.com', password: 'user123', firstName: 'User', lastName: 'User', roles: ['user'] },
      { email: 'guest@example.com', password: 'guest123', firstName: 'Guest', lastName: 'User', roles: ['guest'] },
    ];

    for (const seed of users) {
      const exists = await this.userRepo.findOne({ where: { email: seed.email } });
      if (exists) continue;

      const assignedRoles = await this.roleRepo.find({
        where: seed.roles.map(name => ({ name })),
      });

      // Hash the password before creating the user
      const hashedPassword = await bcrypt.hash(seed.password, saltRounds);

      const user = this.userRepo.create({
        email: seed.email,
        password: hashedPassword,
        firstName: seed.firstName,
        lastName: seed.lastName,
        roles: assignedRoles,
      });

      await this.userRepo.save(user);
    }
  }
}
