import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LookAheadQueryDto {
    @ApiProperty({ description: 'Partial search string', example: 'sri' })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    q: string;
}
