import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class PermissionCsvDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    action: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    subject: string;
}
