import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CaslModule } from '../casl/casl.module';
import { User } from './entities/user.entity';
import { Role } from 'src/casl/entities/role.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthzGuard } from 'src/casl/authz.guard';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([User, Role]),
    CaslModule,
    forwardRef(() => AuthModule) //resolves circular reference]
  ],
  controllers: [UserController],
  providers: [UserService, AuthzGuard],
  exports: [UserService], // Export UserService so other modules can use it
})
export class UserModule { }