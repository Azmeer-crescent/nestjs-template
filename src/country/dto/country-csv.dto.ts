import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CountryCsvDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    alpha2: string;

    @Expose()
    @IsString()
    @Length(3, 3)
    code: string;
}
