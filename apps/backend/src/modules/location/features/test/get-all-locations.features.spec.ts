import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { GetAllLocationsFeature } from '../index';
import { LocationService } from '../../services/location.service';
import { LocationStatusEnum } from '../../enums';

describe('features/GetAllLocationsFeature', () => {
  let locationService: LocationService;
  let getAllLocationsFeature: GetAllLocationsFeature;

  const mockData = {
    _id: '66082529899034a393c5a963',
    name: 'City 02',
    status: LocationStatusEnum.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllLocationsFeature,
        {
          provide: LocationService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([mockData]),
          },
        },
      ],
    }).compile();
    locationService = module.get<LocationService>(LocationService);
    getAllLocationsFeature = module.get<GetAllLocationsFeature>(
      GetAllLocationsFeature,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GetAllLocationsFeature should be defined', () => {
    expect(getAllLocationsFeature).toBeDefined();
  });

  it('GetAllLocationsFeature handle success', async () => {
    const result = await getAllLocationsFeature.handle();
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.data).toEqual([mockData]);
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).not.toBeNull();
  });

  it('GetAllLocationsFeature handle fail', async () => {
    jest.spyOn(locationService, 'getAll').mockRejectedValue(null);
    const result = await getAllLocationsFeature.handle();
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
