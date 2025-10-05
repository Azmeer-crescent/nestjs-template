// src/seeds/role-permission.seeder.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolePermissionSeeder {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>
    ) { }

    async seed() {
        const rolePermissionsMap: Record<string, { action: string; subject: string }[]> = {
            admin: [
                { action: 'manage', subject: 'all' },
            ],
            user: [
                { action: 'read', subject: 'User' },
                { action: 'update', subject: 'User' },
            ],
            manager: [
                { action: 'read', subject: 'User' },
                { action: 'update', subject: 'User' },
                { action: 'delete', subject: 'User' },
            ],
        };

        for (const [roleName, permissions] of Object.entries(rolePermissionsMap)) {
            let role = await this.roleRepo.findOne({
                where: { name: roleName },
                relations: ['permissions'],
            });

            if (!role) {
                role = await this.roleRepo.save(this.roleRepo.create({ name: roleName }));
                console.log(`Created role: ${roleName}`);
            }

            for (const permDef of permissions) {
                let permission = await this.permissionRepo.findOne({
                    where: { action: permDef.action, subject: permDef.subject },
                });

                if (!permission) {
                    permission = await this.permissionRepo.save(
                        this.permissionRepo.create(permDef)
                    );
                    console.log(`Created permission: ${permDef.action} ${permDef.subject}`);
                }

                const alreadyLinked = role.permissions?.some(
                    (p) => p.id === permission.id
                );

                if (!alreadyLinked) {
                    role.permissions = [...(role.permissions || []), permission];
                    await this.roleRepo.save(role);
                    console.log(`Linked ${role.name} → ${permission.action} ${permission.subject}`);
                }
            }
        }
    }
}
