import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getTypeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health.module';
import { CaslModule } from './casl/casl.module';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from './casl/guards/policies.guard';
import { AuthzGuard } from './casl/guards/authz.guard';
import { JwtModule } from '@nestjs/jwt';
import { DemoModule } from './demo/demo.module';
import { CountryModule } from './country/country.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      ttl: 3600, // cache for 1 hour
      max: 100,  // max items in cache
    }),
    CaslModule,
    UserModule,
    AuthModule,
    HealthModule,
    DemoModule,
    CountryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, {
      provide: APP_GUARD,
      useClass: AuthzGuard
    },
  ],
})
export class AppModule { }

/**
providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthzGuard
    }],
 
 */