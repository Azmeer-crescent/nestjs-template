import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { GoogleStrategy } from './strategies/google.strategy';
import { RoleSeeder } from './seeders/role.seeder';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RefreshToken, Role]),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, RoleSeeder],
  controllers: [AuthController],
  exports: [AuthService, RoleSeeder],
})
export class AuthModule { }