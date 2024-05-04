import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { SharedStatus } from '../../../app/enums/shared-status.enum';
import { User } from '../../schemas/user.schema';
import { UserService } from '../../services/user.service';
import { RolesEnum } from '../../enums';

describe('user/services/UserService', () => {
  let userService: UserService;
  let userModel: Model<User>;

  const mockData = {
    _id: '66082529899034a393c5a963',
    name: 'Dr. Mitchell Skiles',
    email: 'Brown.OKeefe11@hotmail.com',
    phone: '0111045783',
    image: null,
    role: RolesEnum.USER,
    status: SharedStatus.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
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
    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('UserService should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('create success', async () => {
    const payload = {
      name: 'Dr. Mitchell Skiles',
      email: 'Brown.OKeefe11@hotmail.com',
      phone: '0111045783',
      image: null,
      role: RolesEnum.USER,
      password: 'password',
    };
    jest
      .spyOn(userModel, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockData as any));
    await expect(userService.create(payload)).resolves.toEqual(mockData);
  });

  it('create fail', async () => {
    const payload = {
      name: 'Dr. Mitchell Skiles',
      email: '',
      phone: '0111045783',
      image: null,
      role: RolesEnum.USER,
      password: '',
    };
    jest
      .spyOn(userModel, 'create')
      .mockImplementationOnce(() => Promise.reject(null as any));
    await expect(userService.create(payload)).rejects.toBeNull();
  });

  it('update success', () => {
    const id = '66082529899034a393c5a963';
    const payload = {
      name: 'Dr. Mitchell Skiles',
      email: 'Brown.OKeefe11@hotmail.com',
      phone: '0111045783',
      image: null,
      role: RolesEnum.USER,
      password: 'password',
      status: SharedStatus.ACTIVE,
    };
    jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(mockData);
    expect(userService.update(id, payload)).resolves.toEqual(mockData);
  });

  it('update fail', () => {
    const id = '';
    const payload = {
      name: 'Dr. Mitchell Skiles',
      email: 'Brown.OKeefe11@hotmail.com',
      phone: '0111045783',
      image: null,
      role: RolesEnum.USER,
      password: 'password',
      status: SharedStatus.ACTIVE,
    };
    jest.spyOn(userModel, 'findByIdAndUpdate').mockRejectedValue(null);
    expect(userService.update(id, payload)).rejects.toBeFalsy();
  });

  it('getAll success', () => {
    jest.spyOn(userModel, 'find').mockResolvedValue([mockData]);
    expect(userService.getAll()).resolves.toEqual([mockData]);
  });

  it('getById success', () => {
    const id = '66082529899034a393c5a963';
    jest.spyOn(userModel, 'findById').mockResolvedValue(mockData);
    expect(userService.getById(id)).resolves.toEqual(mockData);
  });

  it('getById fail', () => {
    const id = '';
    jest.spyOn(userModel, 'findById').mockRejectedValue(null);
    expect(userService.getById(id)).rejects.toBeNull();
  });

  it('getByEmail success', () => {
    const email = 'Brown.OKeefe11@hotmail.com';
    jest.spyOn(userModel, 'findOne').mockResolvedValue(mockData);
    expect(userService.getByEmail(email)).resolves.toEqual(mockData);
  });

  it('getByEmail fail', () => {
    const email = '';
    jest.spyOn(userModel, 'findOne').mockRejectedValue(null);
    expect(userService.getByEmail(email)).rejects.toBeNull();
  });

  it('updateEmailVerified success', () => {
    const id = '66082529899034a393c5a963';
    jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(mockData);
    expect(userService.updateEmailVerified(id)).resolves.toEqual(mockData);
  });

  it('updateEmailVerified fail', () => {
    const id = '';
    jest.spyOn(userModel, 'findByIdAndUpdate').mockRejectedValue(null);
    expect(userService.updateEmailVerified(id)).rejects.toBeFalsy();
  });

  it('refreshUpdatedDate success', () => {
    const id = '66082529899034a393c5a963';
    jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(mockData);
    expect(userService.refreshUpdatedDate(id)).resolves.toMatchObject(mockData);
  });

  it('refreshUpdatedDate fail', () => {
    const id = '';
    jest.spyOn(userModel, 'findByIdAndUpdate').mockRejectedValue(null);
    expect(userService.refreshUpdatedDate(id)).rejects.toBeFalsy();
  });

  it('updatePassword success', async () => {
    const id = '66082529899034a393c5a963';
    const password = 'password';
    jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(mockData);
    await expect(
      userService.updatePassword(id, password),
    ).resolves.toMatchObject(mockData);
  });

  it('updatePassword fail', async () => {
    const id = '';
    const password = 'password';
    jest.spyOn(userModel, 'findByIdAndUpdate').mockRejectedValue(null);
    await expect(userService.updatePassword(id, password)).rejects.toBeFalsy();
  });

  it('delete success', async () => {
    const id = '66082529899034a393c5a963';
    const deleteResult = { acknowledged: true, deletedCount: 1 };
    jest.spyOn(userModel, 'deleteOne').mockResolvedValue(deleteResult);
    await expect(userService.delete(id)).resolves.toEqual(deleteResult);
  });
});
