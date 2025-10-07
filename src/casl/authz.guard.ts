import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CHECK_POLICIES_KEY } from './decorators/check-policies.decorator';
import { PolicyHandlerCallback } from './types';

type PolicyHandler = PolicyHandlerCallback | { handle: PolicyHandlerCallback };

@Injectable()
export class AuthzGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly reflector: Reflector,
        private readonly abilityFactory: CaslAbilityFactory,
        private readonly configService: ConfigService,
    ) {
        console.log('AuthzGuard > constructor');
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('AuthzGuard > canActivate called');

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers?.['authorization'];

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or malformed token');
        }

        const token = authHeader.split(' ')[1];
        let payload: any;

        try {
            payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const user = await this.userService.findByEmail(payload.email);
        if (!user) throw new UnauthorizedException('User not found');
        if (!user.role?.permissions) throw new UnauthorizedException('User permissions not found');

        request.user = user;

        const policyHandlers = this.reflector.get<PolicyHandler[]>(
            CHECK_POLICIES_KEY,
            context.getHandler(),
        ) ?? [];

        if (policyHandlers.length === 0) return true;

        const ability = this.abilityFactory.createForPermissions(user.role.permissions);

        const allowed = policyHandlers.every(handler =>
            typeof handler === 'function'
                ? handler(ability)
                : typeof handler.handle === 'function'
                    ? handler.handle(ability)
                    : false,
        );

        if (!allowed) {
            throw new UnauthorizedException('Insufficient permissions');
        }

        return true;
    }
}
