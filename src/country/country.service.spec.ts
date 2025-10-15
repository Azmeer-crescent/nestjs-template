import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './country.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CountryService', () => {
  let service: CountryService;
  let repo: Repository<Country>;

  const mockCountryRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: getRepositoryToken(Country),
          useValue: mockCountryRepo,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCache,
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
    repo = module.get<Repository<Country>>(getRepositoryToken(Country));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all countries', async () => {
    const countries = [
      { id: 1, name: 'Sri Lanka', alpha2: 'LK', code: '144' },
      { id: 2, name: 'Canada', alpha2: 'CA', code: '124' },
    ];
    mockCountryRepo.find.mockResolvedValueOnce(countries);

    const result = await service.findAll();
    expect(result).toEqual(countries);
    expect(mockCountryRepo.find).toHaveBeenCalled();
  });

  it('should return a country by id', async () => {
    const country = { id: 1, name: 'Sri Lanka', alpha2: 'LK', code: '144' };
    mockCountryRepo.findOne.mockResolvedValueOnce(country);

    const result = await service.findOne(1);
    expect(result).toEqual(country);
    expect(mockCountryRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });

  });

  it('should throw NotFoundException if country not found by id', async () => {
    mockCountryRepo.findOne.mockResolvedValueOnce(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    expect(mockCountryRepo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
  });


  it('should create a country', async () => {
    const dto = { name: 'Canada', alpha2: 'CA', code: '124' };
    const entity = { id: 2, ...dto };

    mockCountryRepo.create.mockReturnValueOnce(entity); // ✅ simulate entity creation
    mockCountryRepo.save.mockResolvedValueOnce(entity); // ✅ simulate DB save

    const result = await service.create(dto);
    expect(result).toEqual(entity);
    expect(mockCountryRepo.create).toHaveBeenCalledWith(dto);
    expect(mockCountryRepo.save).toHaveBeenCalledWith(entity);
  });


  it('should throw error if save fails', async () => {
    mockCountryRepo.save.mockRejectedValueOnce(new Error('DB save failed'));

    await expect(
      service.create({ name: 'Broken', alpha2: 'XX', code: '000' })
    ).rejects.toThrow('DB save failed');
  });

  it('should throw NotFoundException if country to update is not found', async () => {
    mockCountryRepo.findOne.mockResolvedValueOnce(null); // simulate not found

    await expect(service.update(1, { name: 'Ghostland' })).rejects.toThrow(
      new NotFoundException('Country with ID 1 not found')
    );

    expect(mockCountryRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });


  it('should throw NotFoundException if update target is not found', async () => {
    mockCountryRepo.findOne.mockResolvedValueOnce(null);

    await expect(service.update(999, { name: 'Ghostland' })).rejects.toThrow(
      new NotFoundException('Country with ID 999 not found')
    );

    expect(mockCountryRepo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });

  });

  it('should remove a country', async () => {
    const country = { id: 1, name: 'Canada', alpha2: 'CA', code: '124' };
    mockCountryRepo.findOne.mockResolvedValueOnce(country);
    mockCountryRepo.remove.mockResolvedValueOnce(country);

    const result = await service.remove(1);
    expect(result).toBeUndefined();
    expect(mockCountryRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockCountryRepo.remove).toHaveBeenCalledWith(country);
  });

  it('should throw NotFoundException if country to remove is not found', async () => {
    mockCountryRepo.findOne.mockResolvedValueOnce(null); // simulate not found

    await expect(service.remove(1)).rejects.toThrow(
      new NotFoundException('Country with ID 1 not found')
    );

    expect(mockCountryRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw NotFoundException if country to delete is not found', async () => {
    mockCountryRepo.delete.mockResolvedValueOnce({ affected: 0 });
    mockCountryRepo.findOne.mockResolvedValueOnce(null); // simulate not found

    await expect(service.remove(999)).rejects.toThrow(
      new NotFoundException('Country with ID 999 not found')
    );

    expect(mockCountryRepo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });

  });
});
