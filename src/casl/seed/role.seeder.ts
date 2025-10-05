// src/seeds/role.seeder.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleSeeder {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>
    ) { }

    async seed() {
        const roles = ['admin', 'manager', 'supervisor', 'operator', 'user', 'guest'];

        for (const name of roles) {
            const exists = await this.roleRepo.findOne({ where: { name } });
            if (!exists) {
                await this.roleRepo.save(this.roleRepo.create({ name }));
                console.log(`Seeded role: ${name}`);
            }
        }
    }
}
