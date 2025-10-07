import { Injectable } from '@nestjs/common';
import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Role } from '../entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>
    ) { }


    async seed() {
        const saltRounds = 10;

        const defaultUsers = [
            {
                email: 'admin@example.com',
                password: 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                roleName: 'admin',
            },
            {
                email: 'manager@example.com',
                password: 'manager123',
                firstName: 'Manager',
                lastName: 'User',
                roleName: 'manager',
            },
            {
                email: 'user@example.com',
                password: 'user123',
                firstName: 'Regular',
                lastName: 'User',
                roleName: 'user',
            },
            {
                email: 'guest@example.com',
                password: 'guest123',
                firstName: 'Regular',
                lastName: 'Guest',
                roleName: 'guest',
            },
        ];

        for (const userDef of defaultUsers) {
            const existing = await this.userRepo.findOne({ where: { email: userDef.email } });
            if (existing) continue;

            const role = await this.roleRepo.findOne({ where: { name: userDef.roleName } });
            if (!role) {
                console.warn(`Role "${userDef.roleName}" not found. Skipping user "${userDef.email}".`);
                continue;
            }

            // const password = await bcrypt.hash('password123', 10); // default password
            // Hash the password before creating the user
            const hashedPassword = await bcrypt.hash(userDef.password, saltRounds);

            const user = this.userRepo.create({
                email: userDef.email,
                firstName: userDef.firstName,
                lastName: userDef.lastName,
                password: hashedPassword,
                role,
            });

            await this.userRepo.save(user);
            console.log(`Seeded user: ${user.email} with role: ${role.name}`);
        }
    }
}
