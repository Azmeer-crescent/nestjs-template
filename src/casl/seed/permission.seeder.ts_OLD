// src/seeds/permission.seeder.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionSeeder {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>
    ) { }

    async seed() {
        const permissions = [
            { action: 'create', subject: 'User' },
            { action: 'read', subject: 'User' },
            { action: 'update', subject: 'User' },
            { action: 'delete', subject: 'User' },
            { action: 'manage', subject: 'all' },
        ];

        for (const perm of permissions) {
            const exists = await this.permissionRepo.findOne({
                where: { action: perm.action, subject: perm.subject },
            });
            if (!exists) {
                await this.permissionRepo.save(this.permissionRepo.create(perm));
                console.log(`Seeded permission: ${perm.action} ${perm.subject}`);
            }
        }
    }
}
