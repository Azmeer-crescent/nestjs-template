
import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SkipAuthz } from 'src/casl/decorators/skipauthz.decorator';

@Controller('books')
@ApiTags('Books')
@ApiExtraModels(Book, CreateBookDto)
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @SkipAuthz()
    @ApiBearerAuth('access-token')
    create(@Body() dto: CreateBookDto) {
        return this.bookService.create(dto);
    }

    @ApiOperation({
        summary: 'Get all books',
        description: `
      Pagination added  
      Filter by authorId added  
      Examples:  
      - GET /books → all books  
      - GET /books?authorId=2 → only books by author with ID 2  
      - GET /books?page=2&limit=5&authorId=4 → paginated books by author 4
    `,
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiQuery({ name: 'authorId', required: false, type: Number, description: 'Filter books by author ID' })
    @ApiOkResponse({
        description: 'List of books with pagination metadata',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: getSchemaPath(Book) } },
                total: { type: 'number' },
                page: { type: 'number' },
                pageCount: { type: 'number' },
            },
        },
    })
    @Get()
    @UseGuards(JwtAuthGuard)
    @SkipAuthz()
    @ApiBearerAuth('access-token')
    findAll(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('authorId') authorId?: string
    ) {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const authorIdNum = authorId ? parseInt(authorId, 10) : undefined;

        return this.bookService.findAll(pageNum, limitNum, authorIdNum);
    }



    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @SkipAuthz()
    @ApiBearerAuth('access-token')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @SkipAuthz()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update a book by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID of the book to update' })
    @ApiBody({ type: UpdateBookDto })
    @ApiOkResponse({ description: 'Updated book', type: Book })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
        return this.bookService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @SkipAuthz()
    @ApiBearerAuth('access-token')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.remove(id);
    }
}
