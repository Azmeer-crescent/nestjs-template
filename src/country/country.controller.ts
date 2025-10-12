import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Public } from 'src/casl/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipAuthz } from 'src/casl/decorators/skipauthz.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LookAheadQueryDto } from 'src/common/dto/lookahead-query.dto';
import { Country } from './entities/country.entity';

@Controller('country')
@ApiTags('Countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) { }

  @Get('lookup')
  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Look-ahead country search', description: 'Returns countries matching partial input' })
  @ApiQuery({ name: 'q', type: String, required: true, description: 'Partial search string (e.g. "sri")' })
  @ApiResponse({ status: 200, description: 'List of matching countries', type: [Country] })
  lookAhead(@Query() dto: LookAheadQueryDto) {
    return this.countryService.lookAhead(dto.q);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @SkipAuthz()
  @ApiBearerAuth('access-token')
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @SkipAuthz()
  @ApiBearerAuth('access-token')
  @Public()
  findAll() {
    return this.countryService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @SkipAuthz()
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @SkipAuthz()
  @ApiBearerAuth('access-token')
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(+id, updateCountryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @SkipAuthz()
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string) {
    return this.countryService.remove(+id);
  }

  

}
