import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityService } from '../casl-ability.service';
import { CaslAbilityFactory, AppAbility } from '../casl-ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorators/check-policies.decorator';
import { PolicyHandlerCallback } from '../types';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityService: CaslAbilityService,
    private readonly abilityFactory: CaslAbilityFactory
  ) {
    console.log('PoliciesGuard initialized');
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // console.log('PoliciesGuard: request =', request);
    console.log('PoliciesGuard: user =', user);

    const policyHandler = this.reflector.get<PolicyHandlerCallback>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    );

    console.log('PoliciesGuard: policyHandler =', policyHandler);

    if (!policyHandler) return true;

    if (!user?.role?.permissions) {
      console.warn('PoliciesGuard: Missing user permissions');
      throw new UnauthorizedException('User permissions not found');
    }

    const ability = this.abilityFactory.createForPermissions(user.role.permissions);
    console.log('PoliciesGuard: ability.rules =', ability.rules);

    const result = policyHandler(ability);
    console.log('PoliciesGuard: policy result =', result);

    return result;
  }

}
