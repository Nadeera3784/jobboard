import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { DeleteLocationFeature } from '../index';
import { LocationService } from '../../services/location.service';

describe('features/DeleteLocationFeature', () => {
  let locationService: LocationService;
  let deleteLocationFeature: DeleteLocationFeature;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteLocationFeature,
        {
          provide: LocationService,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    await module.init();
    locationService = module.get<LocationService>(LocationService);
    deleteLocationFeature = module.get<DeleteLocationFeature>(
      DeleteLocationFeature,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('DeleteLocationFeature should be defined', () => {
    expect(deleteLocationFeature).toBeDefined();
  });

  it('DeleteLocationFeature handle success', async () => {
    const id = '66082529899034a393c5a963';
    const deleteResult = { acknowledged: true, deletedCount: 1 };
    jest.spyOn(locationService, 'delete').mockResolvedValue(deleteResult);
    const result = await deleteLocationFeature.handle(id);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.message).toEqual(
      'Location has been deleted successfully',
    );
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).toBeNull();
  });

  it('DeleteLocationFeature handle fail', async () => {
    const id = '';
    jest.spyOn(locationService, 'delete').mockRejectedValue(null);
    const result = await deleteLocationFeature.handle(id);
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
