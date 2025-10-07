import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { PoliciesGuard, CheckPolicies, AppAbility } from '../casl';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthzGuard } from 'src/casl/guards/authz.guard';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard, PoliciesGuard)
  // @UseGuards(AuthzGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can('read', 'User'))
  // @CheckPolicies(() => true)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: [User] })
  @ApiBearerAuth('access-token')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('debug')
  @ApiOperation({ summary: 'Get debug info' })
  @ApiBearerAuth('access-token')
  getDebug(@Request() req) {
    console.log('Debug user:', req.user);
    console.log('Debug role:', req.user.role);
    console.log('Debug Permissions:', req.user.role.permissions);
    console.log('User roles:', Array.isArray(req.user.role) ? req.user.role.map(r => r.name) : []);
    console.log('Permissions:', Array.isArray(req.user.role) ? req.user.role.flatMap(r => r.permissions.map(p => p.name)) : []);

    return {
      id: req.user.id,
      email: req.user.email,
      roles: Array.isArray(req.user.roles) ? req.user.roles.map(r => r.name) : [], // safe fallback
    };
  }

}
