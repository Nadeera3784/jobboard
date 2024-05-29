import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CreateLocationFeature } from '../create-location.feature';
import { LocationService } from '../../services/location.service';
import { LocationStatusEnum } from '../../enums';
import { CreateLocationDto } from '../../dtos/index';
import { validate } from 'class-validator';

describe('features/CreateLocationFeature', () => {
  let locationService: LocationService;
  let createLocationFeature: CreateLocationFeature;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateLocationFeature,
        {
          provide: LocationService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    locationService = module.get<LocationService>(LocationService);
    createLocationFeature = module.get<CreateLocationFeature>(
      CreateLocationFeature,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('CreateLocationFeature should be defined', () => {
    expect(createLocationFeature).toBeDefined();
  });

  it('CreateLocationFeature handle success', async () => {
    const input = {
      name: faker.location.city,
    };
    const payload = plainToInstance(CreateLocationDto, input);

    const result = await createLocationFeature.handle(payload);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.message).toEqual(
      'Location has been created successfully',
    );
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).toBeNull();
  });

  it('CreateUserFeature handle fail', async () => {
    const input = {
      name: '',
      status: LocationStatusEnum.ACTIVE,
    };
    const payload = plainToInstance(CreateLocationDto, input);

    const errors = await validate(payload);

    jest.spyOn(locationService, 'create').mockRejectedValue(null);

    const result = await createLocationFeature.handle(payload);

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
