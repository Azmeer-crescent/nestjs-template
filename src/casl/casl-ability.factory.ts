import { Injectable } from '@nestjs/common';
import { MongoAbility, AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Permission } from './entities/permission.entity';

export type AppAbility = MongoAbility<[string, string]>;

@Injectable()
export class CaslAbilityFactory {
  createForPermissions(permissions: Permission[]): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    (permissions ?? []).forEach(({ action, subject }) => {
      if (action && subject) can(action, subject);
    });

    return build();
  }

}
