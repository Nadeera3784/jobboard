import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { getQueueToken } from '@nestjs/bull';
import { UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Queue } from 'bull';

import { SecondFactorService } from '../second-factor.service';
import { CodeNumberGeneratorService } from '../code-number-generator.service';
import { SecondFactor } from '../../schemas';
import { User } from '../../../user/schemas';
import { RolesEnum } from '../../../user/enums';
import { SharedStatus } from '../../../app/enums/shared-status.enum';

describe('SecondFactorService', () => {
  let service: SecondFactorService;
  let codeGenerator: CodeNumberGeneratorService;
  let secondFactorModel: Model<SecondFactor>;
  let emailQueue: Queue;

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

  const mockCode = 123456;

  const mockSecondFactorToken = {
    _id: '507f1f77bcf86cd799439012',
    userId: mockUser._id,
    code: mockCode,
    active: true,
    created_at: new Date(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecondFactorService,
        {
          provide: CodeNumberGeneratorService,
          useValue: {
            generate: jest.fn(),
          },
        },
        {
          provide: getModelToken(SecondFactor.name),
          useValue: {
            updateMany: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            sort: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getQueueToken('second-factor-verification-email'),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SecondFactorService>(SecondFactorService);
    codeGenerator = module.get<CodeNumberGeneratorService>(
      CodeNumberGeneratorService,
    );
    secondFactorModel = module.get<Model<SecondFactor>>(
      getModelToken(SecondFactor.name),
    );
    emailQueue = module.get<Queue>(
      getQueueToken('second-factor-verification-email'),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should generate a new code and send verification email', async () => {
      jest.spyOn(codeGenerator, 'generate').mockResolvedValue(mockCode);
      jest.spyOn(secondFactorModel, 'updateMany').mockResolvedValue({} as any);
      jest
        .spyOn(secondFactorModel, 'create')
        .mockResolvedValue(mockSecondFactorToken as any);
      jest.spyOn(emailQueue, 'add').mockResolvedValue({} as any);

      await service.generate(mockUser);

      expect(codeGenerator.generate).toHaveBeenCalledWith(mockUser._id);
      expect(secondFactorModel.updateMany).toHaveBeenCalledWith(
        { userId: mockUser._id, code: { $ne: mockCode }, active: true },
        { active: false },
      );
      expect(secondFactorModel.create).toHaveBeenCalledWith({
        code: mockCode,
        userId: mockUser._id,
      });
      expect(emailQueue.add).toHaveBeenCalledWith(
        'send-second-factor-verification-email',
        {
          code: mockCode,
          email: mockUser.email,
          user: mockUser,
        },
        { attempts: 3 },
      );
    });

    it('should handle errors during code generation', async () => {
      jest
        .spyOn(codeGenerator, 'generate')
        .mockRejectedValue(new Error('Generation failed'));

      await expect(service.generate(mockUser)).rejects.toThrow(
        'Generation failed',
      );
    });
  });

  describe('resend', () => {
    it('should resend existing active code if found', async () => {
      const mockActiveCode = {
        ...mockSecondFactorToken,
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockSecondFactorToken),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValue(mockActiveCode as any);
      jest.spyOn(emailQueue, 'add').mockResolvedValue({} as any);

      await service.resend(mockUser);

      expect(secondFactorModel.findOne).toHaveBeenCalledWith({
        userId: mockUser._id,
        active: true,
      });
      expect(emailQueue.add).toHaveBeenCalledWith(
        'send-second-factor-verification-email',
        {
          code: mockCode,
          email: mockUser.email,
          user: mockUser,
        },
        { attempts: 3 },
      );
    });

    it('should generate new code if no active code exists', async () => {
      const mockEmptyResult = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValue(mockEmptyResult as any);
      jest.spyOn(codeGenerator, 'generate').mockResolvedValue(mockCode);
      jest.spyOn(secondFactorModel, 'updateMany').mockResolvedValue({} as any);
      jest
        .spyOn(secondFactorModel, 'create')
        .mockResolvedValue(mockSecondFactorToken as any);
      jest.spyOn(emailQueue, 'add').mockResolvedValue({} as any);

      await service.resend(mockUser);

      expect(codeGenerator.generate).toHaveBeenCalledWith(mockUser._id);
      expect(secondFactorModel.create).toHaveBeenCalled();
    });
  });

  describe('validate', () => {
    const mockRequest = {} as Request;

    it('should validate correct code successfully', async () => {
      const mockValidCode = {
        ...mockSecondFactorToken,
        exec: jest.fn().mockResolvedValue(mockSecondFactorToken),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValue(mockValidCode as any);

      const result = await service.validate(
        mockUser._id as string,
        mockCode,
        mockRequest,
      );

      expect(secondFactorModel.findOne).toHaveBeenCalledWith({
        active: true,
        code: mockCode,
        userId: mockUser._id,
      });
      expect(mockSecondFactorToken.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException for invalid code', async () => {
      const mockInvalidCode = {
        exec: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValue(mockInvalidCode as any);

      await expect(
        service.validate(mockUser._id as string, 999999, mockRequest),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.validate(mockUser._id as string, 999999, mockRequest),
      ).rejects.toThrow('Code is invalid, please generate a new one.');
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      const mockInvalidUser = {
        exec: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValue(mockInvalidUser as any);

      await expect(
        service.validate('nonexistent', mockCode, mockRequest),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should deactivate code after successful validation', async () => {
      const mockValidCode = {
        ...mockSecondFactorToken,
        exec: jest.fn().mockResolvedValue(mockSecondFactorToken),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValue(mockValidCode as any);

      await service.validate(mockUser._id as string, mockCode, mockRequest);

      expect(mockSecondFactorToken.active).toBe(false);
      expect(mockSecondFactorToken.save).toHaveBeenCalled();
    });
  });

  describe('sendSecondFactorVerificationCodeEmail', () => {
    it('should add email job to queue successfully', async () => {
      const emailData = {
        code: mockCode,
        email: mockUser.email,
        user: mockUser,
      };

      jest.spyOn(emailQueue, 'add').mockResolvedValue({} as any);

      await service['sendSecondFactorVerificationCodeEmail'](emailData);

      expect(emailQueue.add).toHaveBeenCalledWith(
        'send-second-factor-verification-email',
        emailData,
        { attempts: 3 },
      );
    });

    it('should handle queue errors gracefully', async () => {
      const emailData = {
        code: mockCode,
        email: mockUser.email,
        user: mockUser,
      };

      jest.spyOn(emailQueue, 'add').mockRejectedValue(new Error('Queue error'));

      await expect(
        service['sendSecondFactorVerificationCodeEmail'](emailData),
      ).rejects.toThrow('Queue error');
    });
  });
});
