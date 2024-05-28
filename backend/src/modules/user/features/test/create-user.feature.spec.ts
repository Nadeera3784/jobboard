import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateUserFeature } from '../create-user.feature';
import { UserService } from '../../services/user.service';
import { RolesEnum } from '../../enums';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { FilesystemService } from '../../../core/file-system';

describe('features/CreateUserFeature', () => {
  let userService: UserService;
  let createUserFeature: CreateUserFeature;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserFeature,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            getByEmail: jest.fn(),
          },
        },
        {
          provide: FilesystemService,
          useValue: {
            put: jest.fn(),
          },
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    createUserFeature = module.get<CreateUserFeature>(CreateUserFeature);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('CreateUserFeature should be defined', () => {
    expect(createUserFeature).toBeDefined();
  });

  it('CreateUserFeature handle success', async () => {
    const input = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: '0111034673',
      password: 'password',
      role: RolesEnum.USER,
      image: null,
    };
    const payload = plainToInstance(CreateUserDto, input);

    const result = await createUserFeature.handle(payload);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.message).toEqual(
      'User has been created successfully',
    );
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).toBeNull();
  });

  it('CreateUserFeature handle fail', async () => {
    const input = {
      name: '',
      email: 'johngmail.com',
      phone: faker.phone.number(),
      password: '',
      role: RolesEnum.USER,
      image: null,
    };
    const payload = plainToInstance(CreateUserDto, input);

    jest.spyOn(userService, 'create').mockRejectedValue(null);
    const result = await createUserFeature.handle(payload);

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
