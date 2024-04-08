import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateUserFeature } from '../update-user.feature';
import { UserService } from '../../services/user.service';
import { Roles } from '../../enums';
import { SharedStatus } from '../../../app/enums/shared-status.enum';
import { UpdateUserDto } from '../../dtos';

describe('features/UpdateUserFeature', () => {
  let userService: UserService;
  let updateUserFeature: UpdateUserFeature;

  const mockUser = {
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
        UpdateUserFeature,
        {
          provide: UserService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    updateUserFeature = module.get<UpdateUserFeature>(UpdateUserFeature);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('UpdateUserFeature should be defined', () => {
    expect(updateUserFeature).toBeDefined();
  });

  it('UpdateUserFeature handle success', async () => {
    const id = '66082529899034a393c5a963';

    const input = {
      name: 'Dr. Mitchell Skiles',
      email: 'Brown.OKeefe11@hotmail.com',
      phone: '0064534123',
      image: null,
      role: Roles.USER,
      status: SharedStatus.ACTIVE,
    };
    const payload = plainToInstance(UpdateUserDto, input);
    const errors = await validate(payload);

    expect(errors.length).toBe(0);

    jest.spyOn(userService, 'update').mockReturnValue({
      findByIdAndUpdate: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);

    const result = await updateUserFeature.handle(id, payload);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.message).toEqual(
      'User has been updated successfully',
    );
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).toBeNull();
  });
});
