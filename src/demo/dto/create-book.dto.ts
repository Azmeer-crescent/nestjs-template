import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Gatsby', description: 'Title of the book' })
  @IsString()
  @Expose()
  title: string;

  @ApiProperty({ example: 1925, description: 'Year the book was published' })
  @IsInt()
  @Expose()
  publishedYear: number;

  @ApiProperty({ example: 'Fiction', description: 'Genre of the book' })
  @IsString()
  @Expose()
  genre: string;

  @ApiProperty({ example: 1, description: 'ID of the author' })
  @IsInt()
  @Expose()
  authorId: number;
}
