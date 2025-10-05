import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CHECK_POLICIES_KEY } from './decorators/check-policies.decorator';
import { PolicyHandlerCallback } from './types';

@Injectable()
export class AuthzGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly reflector: Reflector,
        private readonly abilityFactory: CaslAbilityFactory,
    ) {
        console.log('AuthzGuard > constructor');
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('AuthzGuard > canActivate called');
        const request = context.switchToHttp().getRequest();
        const authHeader = request?.headers?.['authorization'];


        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or malformed token');
        }

        const token = authHeader.split(' ')[1];
        let payload: any;
        try {
            payload = this.jwtService.verify(token);
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const user = await this.userService.findByEmail(payload.email);
        console.log("AuthzGuard > User:", user);

        if (!user?.role?.permissions) {
            throw new UnauthorizedException('User permissions not found');
        }

        request.user = user; // ✅ inject user into request

        const policyHandler = this.reflector.get<PolicyHandlerCallback>(
            CHECK_POLICIES_KEY,
            context.getHandler(),
        );

        if (!policyHandler) return true;
        if (policyHandler.toString().includes('() => true')) return true;

        if (typeof policyHandler === 'function') {
            const ability = this.abilityFactory.createForPermissions(user.role.permissions);
            return policyHandler(ability);
        }
        return true;

        // return policyHandler(ability);
    }
}
