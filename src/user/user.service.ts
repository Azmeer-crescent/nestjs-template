import { Injectable, InternalServerErrorException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from '../casl/entities/role.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const role = await this.roleRepo.findOne({ where: { name: 'user' } });
      if (!role) throw new Error('Default role not found');
      createUserDto.role = role;
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation code
        throw new ConflictException('User with this email already exists');
      }
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }


  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email }, relations: ['role', 'role.permissions'],
      // where: { email }, relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    console.log('user_service > findByEmail > Found user:', user);
    console.log('Permissions:', user.role.permissions.map(p => ({
      action: p.action,
      subject: p.subject,
    })));

    return user;
  }
}