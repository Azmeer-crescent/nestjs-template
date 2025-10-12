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
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]), 
    CommonModule],
  providers: [
    CaslAbilityFactory,
    CaslAbilityService,
    RoleSeeder,
    PermissionSeeder,
    RolePermissionSeeder,
    UserSeeder,
  ],
  exports: [
    CaslAbilityService,
    CaslAbilityFactory,
    RoleSeeder,
    PermissionSeeder,
    RolePermissionSeeder,
    UserSeeder,],
})
export class CaslModule { }



