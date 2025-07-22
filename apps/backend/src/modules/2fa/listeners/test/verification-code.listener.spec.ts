import { Test, TestingModule } from '@nestjs/testing';

import { VerificationCodeListener } from '../verification-code.listener';
import { SecondFactorService } from '../../services';
import { SendVerificationCodeEvent } from '../../events';
import { User } from '../../../user/schemas';
import { RolesEnum } from '../../../user/enums';
import { SharedStatus } from '../../../app/enums/shared-status.enum';

describe('VerificationCodeListener', () => {
  let listener: VerificationCodeListener;
  let secondFactorService: SecondFactorService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    role: RolesEnum.USER,
    status: SharedStatus.ACTIVE,
    is_two_factor_authentication_enabled: true,
    email_verified_at: new Date(),
    password: 'hashedpassword',
    created_at: new Date(),
    updated_at: new Date(),
  } as unknown as User;

  const mockEvent: SendVerificationCodeEvent = {
    code: 123456,
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationCodeListener,
        {
          provide: SecondFactorService,
          useValue: {
            sendSecondFactorVerificationCodeEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    listener = module.get<VerificationCodeListener>(VerificationCodeListener);
    secondFactorService = module.get<SecondFactorService>(SecondFactorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('onSendSecondFactorVerificationCodeEvent', () => {
    it('should call sendSecondFactorVerificationCodeEmail with correct event data', async () => {
      jest
        .spyOn(secondFactorService, 'sendSecondFactorVerificationCodeEmail')
        .mockResolvedValue(undefined);

      await listener.onSendSecondFactorVerificationCodeEvent(mockEvent);

      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenCalledWith(mockEvent);
      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors gracefully', async () => {
      jest
        .spyOn(secondFactorService, 'sendSecondFactorVerificationCodeEmail')
        .mockRejectedValue(new Error('Service error'));

      await expect(
        listener.onSendSecondFactorVerificationCodeEvent(mockEvent),
      ).rejects.toThrow('Service error');

      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle null/undefined event', async () => {
      jest
        .spyOn(secondFactorService, 'sendSecondFactorVerificationCodeEmail')
        .mockResolvedValue(undefined);

      await listener.onSendSecondFactorVerificationCodeEvent(null as any);

      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenCalledWith(null);
    });

    it('should handle event with missing user data', async () => {
      const incompleteEvent = {
        code: 123456,
        user: null,
      } as any;

      jest
        .spyOn(secondFactorService, 'sendSecondFactorVerificationCodeEmail')
        .mockResolvedValue(undefined);

      await listener.onSendSecondFactorVerificationCodeEvent(incompleteEvent);

      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenCalledWith(incompleteEvent);
    });

    it('should handle event with missing code', async () => {
      const incompleteEvent = {
        code: null,
        user: mockUser,
      } as any;

      jest
        .spyOn(secondFactorService, 'sendSecondFactorVerificationCodeEmail')
        .mockResolvedValue(undefined);

      await listener.onSendSecondFactorVerificationCodeEvent(incompleteEvent);

      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenCalledWith(incompleteEvent);
    });

    it('should handle different user types correctly', async () => {
      const adminUser = {
        ...mockUser,
        role: RolesEnum.ADMIN,
      } as unknown as User;

      const adminEvent: SendVerificationCodeEvent = {
        code: 654321,
        user: adminUser,
      };

      jest
        .spyOn(secondFactorService, 'sendSecondFactorVerificationCodeEmail')
        .mockResolvedValue(undefined);

      await listener.onSendSecondFactorVerificationCodeEvent(adminEvent);

      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenCalledWith(adminEvent);
      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple consecutive events', async () => {
      jest
        .spyOn(secondFactorService, 'sendSecondFactorVerificationCodeEmail')
        .mockResolvedValue(undefined);

      const event1 = { ...mockEvent, code: 111111 };
      const event2 = { ...mockEvent, code: 222222 };
      const event3 = { ...mockEvent, code: 333333 };

      await listener.onSendSecondFactorVerificationCodeEvent(event1);
      await listener.onSendSecondFactorVerificationCodeEvent(event2);
      await listener.onSendSecondFactorVerificationCodeEvent(event3);

      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenCalledTimes(3);
      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenNthCalledWith(1, event1);
      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenNthCalledWith(2, event2);
      expect(
        secondFactorService.sendSecondFactorVerificationCodeEmail,
      ).toHaveBeenNthCalledWith(3, event3);
    });
  });
});
