import { Roles } from '../../enums';
import { SharedStatus } from '../../../app/enums/shared-status.enum';
import { UpdateUserDto } from '../update-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { stringified } from '../../../../../test/mock-helper';

describe('dtos/UpdateUserDto', () => {
  const mockData = {
    name: 'Dr. Mitchell Skiles',
    email: 'Brown.OKeefe11@hotmail.com',
    phone: '011103456',
    image: null,
    role: Roles.USER,
    status: SharedStatus.ACTIVE,
  };

  it('UpdateUserDto should be defined', () => {
    expect(UpdateUserDto).toBeDefined();
  });

  it('UpdateUserDto success', async () => {
    const payload = plainToInstance(UpdateUserDto, mockData);
    const errors = await validate(payload);
    expect(errors.length).toBe(0);
  });

  it('UpdateUserDto fail', async () => {
    mockData.name = '';
    mockData.email = '';
    const payload = plainToInstance(UpdateUserDto, mockData);
    const errors = await validate(payload);
    expect(stringified(errors)).toContain(`name should not be empty`);
    expect(stringified(errors)).toContain(`email must be an email`);
    expect(errors).not.toBeNull();
  });
});