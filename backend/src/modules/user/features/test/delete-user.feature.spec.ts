import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserFeature } from '../delete-user.feature';
import { UserService } from '../../services/user.service';
import { HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserDeletedListener } from '../../listeners/user-deleted.listener';

describe('features/DeleteUserFeature', () => {
  let userService: UserService;
  let deleteUserFeature: DeleteUserFeature;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserFeature,
        {
          provide: UserService,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
            provide: EventEmitter2,
            useValue: {
               emit: jest.fn(),
            },
        },
      ],
    }).compile();
    await module.init();
    userService = module.get<UserService>(UserService);
    deleteUserFeature = module.get<DeleteUserFeature>(DeleteUserFeature);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('DeleteUserFeature should be defined', () => {
    expect(deleteUserFeature).toBeDefined();
  });

  it('DeleteUserFeature handle success', async () => {
    const id = '66082529899034a393c5a963';
    const deleteResult = { acknowledged: true, deletedCount: 1 };
    jest.spyOn(userService, 'delete').mockResolvedValue(deleteResult);
    const result = await deleteUserFeature.handle(id);
    
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.message).toEqual('User has been deleted successfully');
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).toBeNull();
  });

  it('GetUserByIdFeature handle fail', async () => {
    const id = '';
    jest.spyOn(userService, 'delete').mockRejectedValue(null);
    const result = await deleteUserFeature.handle(id);

    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('response.data');
    expect(result).toHaveProperty('response.message');
    expect(result).toHaveProperty('response.statusCode');
    expect(result.response.message).toEqual('Something went wrong, Please try again later');
    expect(result.response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(result.response.data).toBeNull();
  });
  
});
