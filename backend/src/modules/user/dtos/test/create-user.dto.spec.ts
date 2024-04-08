import { Roles } from '../../enums';
import { SharedStatus } from '../../../app/enums/shared-status.enum';
import { CreateUserDto } from '../create-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { stringified } from '../../../../../test/mock-helper';

describe('dtos/CreateUserDto', () => {
  const mockData = {
    name: 'Dr. Mitchell Skiles',
    email: 'Brown.OKeefe11@hotmail.com',
    phone: '011103456',
    image: null,
    role: Roles.USER,
    password: '123232',
    status: SharedStatus.ACTIVE,
  };

  it('CreateUserDto should be defined', () => {
    expect(CreateUserDto).toBeDefined();
  });

  it('CreateUserDto success', async () => {
    const payload = plainToInstance(CreateUserDto, mockData);
    const errors = await validate(payload);
    expect(errors.length).toBe(0);
  });

  it('CreateUserDto fail', async () => {
    mockData.password = '';
    mockData.name = '';
    mockData.email = '';
    const payload = plainToInstance(CreateUserDto, mockData);
    const errors = await validate(payload);
    expect(stringified(errors)).toContain(`password should not be empty`);
    expect(stringified(errors)).toContain(`name should not be empty`);
    expect(stringified(errors)).toContain(`email must be an email`);
    expect(errors).not.toBeNull();
  });
});
