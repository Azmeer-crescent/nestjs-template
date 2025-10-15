import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { NotFoundException } from '@nestjs/common';

describe('CountryController', () => {
  let controller: CountryController;

  const mockCountryService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Sri Lanka' }),
    create: jest.fn().mockResolvedValue({ id: 2, name: 'Canada', alpha2: 'CA', code: '124' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Country' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        {
          provide: CountryService,
          useValue: mockCountryService,
        },
      ],
    }).compile();

    controller = module.get<CountryController>(CountryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return countries from service', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([]);
    expect(mockCountryService.findAll).toHaveBeenCalled();
  });

  it('should create a country', async () => {
    const dto = { name: 'Canada', alpha2: 'CA', code: '124' };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: 2, name: 'Canada', alpha2: 'CA', code: '124' });
    expect(mockCountryService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a country', async () => {
    const id = '1';
    const dto = { name: 'Updated Country' };
    const result = await controller.update(id, dto);
    expect(result).toEqual({ id: 1, name: 'Updated Country' });
    expect(mockCountryService.update).toHaveBeenCalledWith(+id, dto);
  });

  it('should remove a country', async () => {
    const id = '1';
    const result = await controller.remove(id);
    expect(result).toBeUndefined();
    expect(mockCountryService.remove).toHaveBeenCalledWith(+id);
  });

  // 🔥 Edge Case: update non-existent country
  it('should throw NotFoundException on update if country not found', async () => {
    mockCountryService.update.mockRejectedValueOnce(new NotFoundException('Country not found'));
    await expect(controller.update('999', { name: 'Ghostland' })).rejects.toThrow(NotFoundException);
  });

  // 🔥 Edge Case: remove non-existent country
  it('should throw NotFoundException on remove if country not found', async () => {
    mockCountryService.remove.mockRejectedValueOnce(new NotFoundException('Country not found'));
    await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
  });

  // 🔥 Edge Case: create with invalid input
  it('should handle invalid input on create', async () => {
    const dto = { name: '', alpha2: '', code: '' }; // assuming all fields are required
    mockCountryService.create.mockRejectedValueOnce(new Error('Validation failed'));
    await expect(controller.create(dto)).rejects.toThrow('Validation failed');
  });

  // 🔥 Edge Case: unexpected internal error
  it('should handle unexpected errors in findOne', async () => {
    mockCountryService.findOne.mockRejectedValueOnce(new Error('Unexpected DB error'));
    await expect(controller.findOne('1')).rejects.toThrow('Unexpected DB error');
  });
});
