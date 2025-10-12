import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
    @ApiProperty({ example: 'Sri Lanka', description: 'Full name of the country' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'LK', description: 'ISO 3166-1 alpha-2 country code (2 letters)' })
    @IsString()
    @Length(2, 2)
    alpha2: string;

    @ApiProperty({ example: '144', description: 'ISO 3166-1 numeric country code (3-digit string)' })
    @IsString()
    @Matches(/^\d{3}$/, { message: 'code must be a 3-digit string' })
    code: string;
}
