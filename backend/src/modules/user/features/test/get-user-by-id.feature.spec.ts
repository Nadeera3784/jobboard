import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { GetUserByIdFeature } from '../get-user-by-id.feature';
import { UserService } from '../../services/user.service';
import { Roles } from '../../enums';
import { SharedStatus } from '../../../app/enums/shared-status.enum';

describe('features/GetUserByIdFeature', () => {
  let userService: UserService;
  let getUserByIdFeature: GetUserByIdFeature;

  const mockData = {
    _id: '66082529899034a393c5a963',
    name: 'Dr. Mitchell Skiles',
    email: 'Brown.OKeefe11@hotmail.com',
    phone: '011103456',
    image: null,
    role: Roles.USER,
    status: SharedStatus.ACTIVE,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByIdFeature,
        {
          provide: UserService,
          useValue: {
            getById: jest.fn().mockResolvedValue(mockData),
          },
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    getUserByIdFeature = module.get<GetUserByIdFeature>(GetUserByIdFeature);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GetUserByIdFeature should be defined', () => {
    expect(getUserByIdFeature).toBeDefined();
  });

  it('GetUserByIdFeature handle success', async () => {
    const id = '66082529899034a393c5a963';
    const result = await getUserByIdFeature.handle(id);
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.data).toMatchObject(mockData);
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).not.toBeNull();
  });

  it('GetUserByIdFeature handle fail', async () => {
    const id = '';
    jest.spyOn(userService, 'getById').mockRejectedValue(null);
    const result = await getUserByIdFeature.handle(id);
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
