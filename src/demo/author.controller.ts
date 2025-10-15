import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SkipAuthz } from '../casl/decorators/skipauthz.decorator';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('authors')
@ApiTags('Authors')
export class AuthorController {
    constructor(private readonly authorService: AuthorService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @SkipAuthz()
    @ApiBearerAuth('access-token')
    @ApiBody({ type: CreateBookDto })
    create(@Body() dto: CreateAuthorDto) {
        return this.authorService.create(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @SkipAuthz()
    @ApiBearerAuth('access-token')
    findAll() {
        return this.authorService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @SkipAuthz()
    @ApiBearerAuth('access-token')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.authorService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @SkipAuthz()
    @ApiBearerAuth('access-token')
    @ApiBody({ type: UpdateBookDto })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAuthorDto) {
        return this.authorService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @SkipAuthz()
    @ApiBearerAuth('access-token')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.authorService.remove(id);
    }
}
