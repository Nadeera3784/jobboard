import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { EventDispatcher } from '../../../core/event-dispatcher';

import { DeleteUserFeature } from '../delete-user.feature';
import { UserService } from '../../services/user.service';
import { UserDeletedEvent } from '../../events';
import { USER_DELETED } from '../../constants';

describe('features/DeleteUserFeature', () => {
  let userService: UserService;
  let deleteUserFeature: DeleteUserFeature;
  let eventDispatcher: EventDispatcher;

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
          provide: EventDispatcher,
          useValue: {
            dispatch: jest.fn(),
          },
        },
      ],
    }).compile();
    await module.init();
    userService = module.get<UserService>(UserService);
    deleteUserFeature = module.get<DeleteUserFeature>(DeleteUserFeature);
    eventDispatcher = module.get<EventDispatcher>(EventDispatcher);
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
    expect(result.response.message).toEqual(
      'User has been deleted successfully',
    );
    expect(result.response.statusCode).toEqual(HttpStatus.OK);
    expect(result.response.data).toBeNull();

    const event = new UserDeletedEvent();
    event.id = id;
    expect(eventDispatcher.dispatch).toHaveBeenCalled();
    expect(eventDispatcher.dispatch).toHaveBeenCalledTimes(1);
    expect(eventDispatcher.dispatch).toHaveBeenCalledWith(USER_DELETED, event);
  });

  it('DeleteUserFeature handle fail', async () => {
    const id = '';
    jest.spyOn(userService, 'delete').mockRejectedValue(null);
    const result = await deleteUserFeature.handle(id);

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
