import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { GetAllUsersFeature } from '../get-all-users.features';
import { UserService } from '../../services/user.service';
import { RolesEnum } from '../../enums';
import { SharedStatus } from '../../../app/enums/shared-status.enum';

describe('features/GetAllUsersFeature', () => {
  let userService: UserService;
  let getAllUsersFeature: GetAllUsersFeature;

  const mockData = {
    _id: '66082529899034a393c5a963',
    name: 'Dr. Mitchell Skiles',
    email: 'Brown.OKeefe11@hotmail.com',
    phone: '011103456',
    image: null,
    role: RolesEnum.USER,
    status: SharedStatus.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllUsersFeature,
        {
          provide: UserService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([mockData]),
          },
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    getAllUsersFeature = module.get<GetAllUsersFeature>(GetAllUsersFeature);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GetAllUsersFeature should be defined', () => {
    expect(getAllUsersFeature).toBeDefined();
  });

  it('GetAllUsersFeature handle success', async () => {
    const result = await getAllUsersFeature.handle();
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.data).toEqual([mockData]);
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).not.toBeNull();
  });

  it('GetAllUsersFeature handle fail', async () => {
    jest.spyOn(userService, 'getAll').mockRejectedValue(null);
    const result = await getAllUsersFeature.handle();
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
