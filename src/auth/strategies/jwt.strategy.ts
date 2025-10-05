import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../jwt-payload'; // adjust path if needed
import { UserService } from '../../user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your-secret-key'),
    });
  }

  // async validate(payload: any) {
  //   return { userId: payload.sub, email: payload.email };
  // }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findByEmail(payload.email); // ✅ must return full user
    if (!user) throw new UnauthorizedException('User not found');

    if (!user?.role?.permissions) {
      throw new UnauthorizedException('User permissions not found');
    }
    console.log('JWT payload:', payload);
    console.log('Validated user:', user);

    return user;
  }

}