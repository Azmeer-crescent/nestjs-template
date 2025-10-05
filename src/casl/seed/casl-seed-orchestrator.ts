// src/casl/seed/casl-seed-orchestrator.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { RoleSeeder } from './role.seeder';
import { PermissionSeeder } from './permission.seeder';
import { RolePermissionSeeder } from './role-permission.seeder';
import { UserSeeder } from './user.seeder';

@Injectable()
export class CaslSeedOrchestrator implements OnApplicationBootstrap {
  constructor(
    private readonly roleSeeder: RoleSeeder,
    private readonly permissionSeeder: PermissionSeeder,
    private readonly rolePermissionSeeder: RolePermissionSeeder,
    private readonly userSeeder: UserSeeder
  ) {}

  async onApplicationBootstrap() {
    await this.roleSeeder.seed?.();
    await this.permissionSeeder.seed?.();
    await this.rolePermissionSeeder.seed?.();
    await this.userSeeder.seed?.();
    console.log('✅ CASL seeding complete');
  }
}
