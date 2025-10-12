import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Jane Austen', description: 'Full name of the author' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ example: 'British', description: 'Nationality of the author' })
  @IsString()
  @Expose()
  nationality: string;

  @ApiPropertyOptional({ example: 1775, description: 'Birth year of the author' })
  @IsOptional()
  @IsInt()
  @Expose()
  birthYear?: number;
}
