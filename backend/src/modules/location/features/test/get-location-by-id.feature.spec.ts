import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { GetLocationByIdFeature } from '../get-location-by-id.feature';
import { LocationService } from '../../services/location.service';
import { LocationStatusEnum } from '../../enums';

describe('features/GetLocationByIdFeature', () => {
  let locationService: LocationService;
  let getLocationByIdFeature: GetLocationByIdFeature;

  const mockData = {
    _id: '66082529899034a393c5a963',
    name: 'City 01',
    status: LocationStatusEnum.ACTIVE,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLocationByIdFeature,
        {
          provide: LocationService,
          useValue: {
            getById: jest.fn().mockResolvedValue(mockData),
          },
        },
      ],
    }).compile();
    locationService = module.get<LocationService>(LocationService);
    getLocationByIdFeature = module.get<GetLocationByIdFeature>(
      GetLocationByIdFeature,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GetLocationByIdFeature should be defined', () => {
    expect(getLocationByIdFeature).toBeDefined();
  });

  it('GetLocationByIdFeature handle success', async () => {
    const id = '66082529899034a393c5a963';
    const result = await getLocationByIdFeature.handle(id);
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.data).toMatchObject(mockData);
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).not.toBeNull();
  });

  it('GetLocationByIdFeature handle fail', async () => {
    const id = '';
    jest.spyOn(locationService, 'getById').mockRejectedValue(null);
    const result = await getLocationByIdFeature.handle(id);
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
