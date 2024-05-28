import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { MockResponse, createResponse } from 'node-mocks-http';
import { Response } from 'express';

import {
  CreateUserFeature,
  DatatableFeature,
  DeleteUserFeature,
  GetAllUsersFeature,
  GetUserByIdFeature,
  UpdateUserFeature,
} from '../../features';
import { UserController } from '../user.controller';
import { UserService } from '../../services/user.service';
import { RolesEnum, UserStatusEnum } from '../../enums';
import { HttpStatus } from '@nestjs/common';
import { IdDto } from '../../../app/dtos/Id.dto';
import { CreateUserDto, UpdateUserDto } from '../../dtos';
import { FilesystemService } from '../../../core/file-system';
import { AuthenticationGuard } from '../../../authentication/guards/authentication.guard';
import { ConfigService } from '@nestjs/config';
import { EventDispatcher } from '../../../core/event-dispatcher';

describe('controllers/UserController', () => {
  let getAllUsersFeature: GetAllUsersFeature;
  let getUserByIdFeature: GetUserByIdFeature;
  let createUserFeature: CreateUserFeature;
  let updateUserFeature: UpdateUserFeature;
  let deleteUserFeature: DeleteUserFeature;
  let userController: UserController;
  let response: MockResponse<Response>;


  const mockData = {
    _id: '66082529899034a393c5a963',
    name: 'Dr. Mitchell Skiles',
    email: 'Brown.OKeefe11@hotmail.com',
    phone: '011103456',
    image: null,
    role: RolesEnum.USER,
    status: UserStatusEnum.ACTIVE,
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
        GetUserByIdFeature,
        {
          provide: UserService,
          useValue: {
            getById: jest.fn().mockResolvedValue(mockData),
          },
        },
        UpdateUserFeature,
        {
          provide: UserService,
          useValue: {
            updae: jest.fn().mockResolvedValue(mockData),
          },
        },
        DeleteUserFeature,
        {
          provide: UserService,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: EventDispatcher,
          useValue: {
            dispatch: jest.fn(),
          },
        },
        CreateUserFeature,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: FilesystemService,
          useValue: {
            put: jest.fn(),
          },
        },
        DatatableFeature,
        {
          provide: UserService,
          useValue: {
            datatable: jest.fn(),
          },
        },
        AuthenticationGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getById: jest.fn().mockResolvedValue(mockData),
          },
        },
      ],
      controllers: [UserController],
    }).compile();
    getAllUsersFeature = module.get<GetAllUsersFeature>(GetAllUsersFeature);
    getUserByIdFeature = module.get<GetUserByIdFeature>(GetUserByIdFeature);
    createUserFeature = module.get<CreateUserFeature>(CreateUserFeature);
    updateUserFeature = module.get<UpdateUserFeature>(UpdateUserFeature);
    deleteUserFeature = module.get<DeleteUserFeature>(DeleteUserFeature);
    userController = module.get<UserController>(UserController);
    response = createResponse();
  });

  it('UserController should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('UserController getAll', async () => {
    const spyOn = jest.spyOn(getAllUsersFeature, 'handle');
    spyOn.mockResolvedValue({
      response: {
        data: [mockData],
        message: null,
        statusCode: HttpStatus.OK,
      },
      status: HttpStatus.OK,
    });
    mockRepnonse();
    await userController.getAll(response);
    expect(spyOn).toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith({
      data: [mockData],
      message: null,
      statusCode: HttpStatus.OK,
    });
  });

  it('UserController getById', async () => {
    const spyOn = jest.spyOn(getUserByIdFeature, 'handle');
    spyOn.mockResolvedValue({
      response: {
        data: mockData,
        message: null,
        statusCode: HttpStatus.OK,
      },
      status: HttpStatus.OK,
    });
    mockRepnonse();
    const idto = new IdDto();
    idto.id = '66082529899034a393c5a963';
    await userController.getById(response, idto);
    expect(spyOn).toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith({
      data: mockData,
      message: null,
      statusCode: HttpStatus.OK,
    });
  });

  it('UserController create', async () => {
    const spyOn = jest.spyOn(createUserFeature, 'handle');
    spyOn.mockResolvedValue({
      response: {
        data: null,
        message: 'User has been created successfully',
        statusCode: HttpStatus.OK,
      },
      status: HttpStatus.OK,
    });
    mockRepnonse();
    const input = {
      name: 'Dr. Mitchell Skiles',
      email: 'Brown.OKeefe11@hotmail.com',
      phone: '011103456',
      password: 'password',
      role: RolesEnum.USER,
      image: null,
    };
    const payload = plainToInstance(CreateUserDto, input);
    const file: Express.Multer.File = null;
    await userController.create(response, file, payload);
    expect(spyOn).toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith({
      data: null,
      message: 'User has been created successfully',
      statusCode: HttpStatus.OK,
    });
  });

  it('UserController update', async () => {
    const spyOn = jest.spyOn(updateUserFeature, 'handle');
    spyOn.mockResolvedValue({
      response: {
        data: null,
        message: 'User has been updated successfully',
        statusCode: HttpStatus.OK,
      },
      status: HttpStatus.OK,
    });
    mockRepnonse();
    const idto = new IdDto();
    idto.id = '66082529899034a393c5a963';
    const input = {
      name: 'Dr. Mitchell Skiles',
      email: 'Brown.OKeefe11@hotmail.com',
      phone: '0064534123',
      image: null,
      role: RolesEnum.USER,
      status: UserStatusEnum.ACTIVE,
    };
    const payload = plainToInstance(UpdateUserDto, input);
    await userController.update(response, idto, payload);
    expect(spyOn).toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith({
      data: null,
      message: 'User has been updated successfully',
      statusCode: HttpStatus.OK,
    });
  });

  it('UserController delete', async () => {
    const spyOn = jest.spyOn(deleteUserFeature, 'handle');
    spyOn.mockResolvedValue({
      response: {
        data: null,
        message: 'User has been deleted successfully',
        statusCode: HttpStatus.OK,
      },
      status: HttpStatus.OK,
    });
    mockRepnonse();
    const idto = new IdDto();
    idto.id = '66082529899034a393c5a963';
    await userController.delete(response, idto);
    expect(spyOn).toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith({
      data: null,
      message: 'User has been deleted successfully',
      statusCode: HttpStatus.OK,
    });
  });

  const mockRepnonse = () => {
    response.json = jest.fn().mockReturnThis();
    response.status = jest.fn().mockReturnThis();
  }

});
