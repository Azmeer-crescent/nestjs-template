import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslAbilityService } from './casl-ability.service';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { User } from '../user/entities/user.entity';
import { RoleSeeder } from './seed/role.seeder';
import { PermissionSeeder } from './seed/permission.seeder';
import { RolePermissionSeeder } from './seed/role-permission.seeder';
import { UserSeeder } from './seed/user.seeder';
import { CaslSeedOrchestrator } from './seed/casl-seed-orchestrator';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])], // ✅ Only entities here
  providers: [
    CaslAbilityFactory,
    CaslAbilityService,
    RoleSeeder,
    PermissionSeeder,
    RolePermissionSeeder,
    UserSeeder,
    CaslSeedOrchestrator
  ],
  exports: [CaslAbilityService, CaslAbilityFactory],
})
export class CaslModule { }



