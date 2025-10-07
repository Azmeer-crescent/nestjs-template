import { forwardRef,Module } from '@nestjs/common';
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
import { Role } from 'src/casl/entities/role.entity';
import { AuthzGuard } from 'src/casl/guards/authz.guard';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
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
    forwardRef(() => UserModule), // breaks the circular-ref cycle,
    CaslModule,
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, AuthzGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, AuthzGuard],
})
export class AuthModule {}