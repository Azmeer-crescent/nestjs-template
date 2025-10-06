import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your-secret-key'),
    });
  }

  /*
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
  
*/
  //Need for Role management
  async validate(payload: any): Promise<User> {
    const user = await this.userService.findByEmail(payload.email);
    return user; // this becomes req.user
  }

}