import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CaslAbilityFactory } from './casl-ability.factory';

@Injectable()
export class CaslAbilityService {
  constructor(
    @InjectRepository(User) 
    private readonly usersRepo: Repository<User>,
    private readonly abilityFactory: CaslAbilityFactory
  ) {}

  async getAbilityForUser(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const permissions = user?.role?.permissions ?? [];
    return this.abilityFactory.createForPermissions(permissions);
  }
}
