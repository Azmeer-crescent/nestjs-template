import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeeder {
    constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) { }
    
    async seed() {
        const roles = ['admin', 'manager', 'supervisor', 'operator', 'user', 'guest'];
        for (const name of roles) {
            const exists = await this.roleRepo.findOne({ where: { name } });
            if (!exists) await this.roleRepo.save(this.roleRepo.create({ name }));
        }
    }
}
