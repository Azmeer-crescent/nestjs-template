import { SetMetadata } from "@nestjs/common";

export const SKIP_AUTHZ_KEY = 'skipAuthz';
export const SkipAuthz = () => SetMetadata(SKIP_AUTHZ_KEY, true);
