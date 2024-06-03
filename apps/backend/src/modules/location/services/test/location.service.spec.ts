import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { LocationStatusEnum } from '../../enums';
import { Location } from '../../schemas/location.schema';
import { LocationService } from '../../services/location.service';

describe('location/services/UserService', () => {
  let locationService: LocationService;
  let locationModel: Model<Location>;

  const mockData = {
    _id: '66082529899034a393c5a963',
    name: 'Melbourne',
    status: LocationStatusEnum.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getModelToken('Location'),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
        ConfigService,
      ],
    }).compile();
    locationService = module.get<LocationService>(LocationService);
    locationModel = module.get<Model<Location>>(getModelToken('Location'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('LocationService should be defined', () => {
    expect(locationService).toBeDefined();
  });

  it('create success', async () => {
    const payload = {
      name: 'Brisbane',
    };
    jest
      .spyOn(locationModel, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockData as any));
    await expect(locationService.create(payload)).resolves.toEqual(mockData);
  });

  it('create fail', async () => {
    const payload = {
      name: '',
    };
    jest
      .spyOn(locationModel, 'create')
      .mockImplementationOnce(() => Promise.reject(null as any));
    await expect(locationService.create(payload)).rejects.toBeNull();
  });

  it('update success', () => {
    const id = '66082529899034a393c5a963';
    const payload = {
      name: 'Perth',
      status: LocationStatusEnum.ACTIVE,
    };
    jest.spyOn(locationModel, 'findByIdAndUpdate').mockResolvedValue(mockData);
    expect(locationService.update(id, payload)).resolves.toEqual(mockData);
  });

  it('update fail', () => {
    const id = '';
    const payload = {
      name: '',
      status: LocationStatusEnum.ACTIVE,
    };
    jest.spyOn(locationModel, 'findByIdAndUpdate').mockRejectedValue(null);
    expect(locationService.update(id, payload)).rejects.toBeFalsy();
  });

  it('getAll success', () => {
    jest.spyOn(locationModel, 'find').mockResolvedValue([mockData]);
    expect(locationService.getAll()).resolves.toEqual([mockData]);
  });

  it('getById success', () => {
    const id = '66082529899034a393c5a963';
    jest.spyOn(locationModel, 'findById').mockResolvedValue(mockData);
    expect(locationService.getById(id)).resolves.toEqual(mockData);
  });

  it('getById fail', () => {
    const id = '';
    jest.spyOn(locationModel, 'findById').mockRejectedValue(null);
    expect(locationService.getById(id)).rejects.toBeNull();
  });
});
