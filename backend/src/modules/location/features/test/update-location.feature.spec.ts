import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateLocationFeature } from '../update-location-feature';
import { LocationService } from '../../services/location.service';
import { LocationStatusEnum } from '../../enums';
import { UpdateLocationDto } from '../../dtos';
import { UtilityService } from '../../../app/services/utility.service';

describe('features/UpdateLocationFeature', () => {
  let locationService: LocationService;
  let updateLocationFeature: UpdateLocationFeature;

  const mockUser = {
    _id: '66082529899034a393c5a963',
    name: 'City 02',
    status: LocationStatusEnum.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateLocationFeature,
        {
          provide: LocationService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();
    locationService = module.get<LocationService>(LocationService);
    updateLocationFeature = module.get<UpdateLocationFeature>(
      UpdateLocationFeature,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('UpdateLocationFeature should be defined', () => {
    expect(updateLocationFeature).toBeDefined();
  });

  it('UpdateLocationFeature handle success', async () => {
    const id = '66082529899034a393c5a963';

    const input = {
      name: 'City 03',
      status: LocationStatusEnum.ACTIVE,
    };
    const payload = plainToInstance(UpdateLocationDto, input);
    const errors = await validate(payload);

    expect(errors.length).toBe(0);

    jest.spyOn(locationService, 'update').mockReturnValue({
      findByIdAndUpdate: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);

    const result = await updateLocationFeature.handle(id, payload);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.message).toEqual(
      'Location has been updated successfully',
    );
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).toBeNull();
  });

  it('UpdateLocationFeature handle error', async () => {
    const id = '66082529899034a393c5a963';

    const input = {
      name: '',
      status: LocationStatusEnum.ACTIVE,
    };
    const payload = plainToInstance(UpdateLocationDto, input);
    const errors = await validate(payload);

    expect(errors.length).toBe(1);
    expect(UtilityService.stringFied(errors)).toContain(
      `name should not be empty`,
    );
    expect(UtilityService.stringFied(errors)).toContain(
      `name must be longer than or equal to 1 characters`,
    );

    jest.spyOn(locationService, 'update').mockRejectedValueOnce(null);

    const result = await updateLocationFeature.handle(id, payload);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.message).toEqual(
      'Something went wrong, Please try again later',
    );
    expect(result.response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(result.response.data).toBeNull();
  });
});
