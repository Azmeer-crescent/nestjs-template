/**
 * Authorization Guard using CASL
 * Checks if the user has the necessary permissions to access a resource
 * based on their role and the defined policies.
 * 
 * @public() --> Marks routes as public (no auth required)
 * @skipAuthz() --> Skips authorization check for the route
 * @UseGuards(AuthzGuard) --> Apply this guard to a route or controller. Which checks for permissions for the route
 * 
 */
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { CaslAbilityFactory } from '../casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { PolicyHandlerCallback } from '../types';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SKIP_AUTHZ_KEY } from '../decorators/skipauthz.decorator';

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
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        //dont check permission for public routes
        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
        if (isPublic) return true;

        //skip authz check if @SkipAuthz is present
        const skipAuthz = this.reflector.get<boolean>(SKIP_AUTHZ_KEY, context.getHandler());
        if (skipAuthz) return true;

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

        const action = this.mapHttpMethodToAction(request.method); // e.g. 'GET' → 'read'
        const resource = this.extractResourceFromController(context.getClass()); // e.g. 'User'

        const ability = this.abilityFactory.createForPermissions(user.role.permissions);
        if (!ability.can(action, resource)) {
            throw new ForbiddenException('Insufficient permissions');
        }








        /*
        
                const policyHandlers = this.reflector.get<PolicyHandler[]>(
                    CHECK_POLICIES_KEY,
                    context.getHandler(),
                ) ?? [];
        
                if (policyHandlers.length === 0) return true;
        
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
        */
        return true;
    }

    /**
     * Converts HTTP methods to action strings
     * 
     * @param method HTTP Method
     * @returns 
     */
    private mapHttpMethodToAction(method: string): string {
        switch (method.toUpperCase()) {
            case 'GET':
                return 'read';
            case 'POST':
                return 'create';
            case 'PUT':
            case 'PATCH':
                return 'update';
            case 'DELETE':
                return 'delete';
            default:
                return 'manage'; // fallback for non-standard methods
        }
    }

    /**
     * Extracts resource name from controller class
     * 
     * @param controller Controller class
     * @returns 
     */
    private extractResourceFromController(controller: Function): string {
        const name = controller.name.replace('Controller', '');
        return name.charAt(0).toUpperCase() + name.slice(1); // e.g. 'User'
    }

}
