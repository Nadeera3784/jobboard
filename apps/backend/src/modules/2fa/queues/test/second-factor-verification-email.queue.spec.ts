import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { SecondFactorVerificationMailQueue } from '../second-factor-verification-email.queue';
import { EmailService } from '../../../app/services';
import { User } from '../../../user/schemas';
import { RolesEnum } from '../../../user/enums';
import { SharedStatus } from '../../../app/enums/shared-status.enum';

describe('SecondFactorVerificationMailQueue', () => {
  let queue: SecondFactorVerificationMailQueue;
  let emailService: EmailService;
  let loggerSpy: jest.SpyInstance;

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

  const mockJobData = {
    code: 123456,
    email: mockUser.email,
    user: mockUser,
  };

  const mockJob = {
    id: 'job-123',
    name: 'send-second-factor-verification-email',
    data: mockJobData,
  } as Job;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecondFactorVerificationMailQueue,
        {
          provide: EmailService,
          useValue: {
            sendSecondFactorCodeEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    queue = module.get<SecondFactorVerificationMailQueue>(
      SecondFactorVerificationMailQueue,
    );
    emailService = module.get<EmailService>(EmailService);

    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    loggerSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(queue).toBeDefined();
  });

  describe('onActive', () => {
    it('should log when job becomes active', () => {
      queue.onActive(mockJob);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Processing job ${mockJob.id} of type ${mockJob.name}`,
      );
    });

    it('should handle job without id', () => {
      const jobWithoutId = { ...mockJob, id: undefined } as Job;

      queue.onActive(jobWithoutId);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Processing job undefined of type ${mockJob.name}`,
      );
    });

    it('should handle job without name', () => {
      const jobWithoutName = { ...mockJob, name: undefined } as Job;

      queue.onActive(jobWithoutName);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Processing job ${mockJob.id} of type undefined`,
      );
    });
  });

  describe('onCompleted', () => {
    it('should log when job is completed', () => {
      queue.onCompleted(mockJob);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Job ${mockJob.id} of type ${mockJob.name} completed`,
      );
    });

    it('should handle completed job without id', () => {
      const jobWithoutId = { ...mockJob, id: undefined } as Job;

      queue.onCompleted(jobWithoutId);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Job undefined of type ${mockJob.name} completed`,
      );
    });
  });

  describe('send', () => {
    it('should send email successfully', async () => {
      jest
        .spyOn(emailService, 'sendSecondFactorCodeEmail')
        .mockResolvedValue(undefined);

      await queue.send(mockJob);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Mail sending started',
        mockJob.name,
      );
      expect(emailService.sendSecondFactorCodeEmail).toHaveBeenCalledWith(
        mockJobData.email,
        mockJobData.code,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Mail sending sent',
        mockJobData.email,
      );
    });

    it('should handle email service errors', async () => {
      const errorMessage = 'Email service error';
      jest
        .spyOn(emailService, 'sendSecondFactorCodeEmail')
        .mockRejectedValue(new Error(errorMessage));

      await queue.send(mockJob);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Mail sending started',
        mockJob.name,
      );
      expect(emailService.sendSecondFactorCodeEmail).toHaveBeenCalledWith(
        mockJobData.email,
        mockJobData.code,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Failed to send email | error: ${errorMessage}`,
      );
    });

    it('should handle missing job data', async () => {
      const jobWithoutData = { ...mockJob, data: null } as Job;
      jest
        .spyOn(emailService, 'sendSecondFactorCodeEmail')
        .mockResolvedValue(undefined);

      await queue.send(jobWithoutData);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Mail sending started',
        mockJob.name,
      );
      expect(emailService.sendSecondFactorCodeEmail).not.toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to send email | error:'),
      );
    });

    it('should handle missing email in job data', async () => {
      const jobWithMissingEmail = {
        ...mockJob,
        data: { code: 123456, email: undefined },
      } as Job;
      jest
        .spyOn(emailService, 'sendSecondFactorCodeEmail')
        .mockResolvedValue(undefined);

      await queue.send(jobWithMissingEmail);

      expect(emailService.sendSecondFactorCodeEmail).toHaveBeenCalledWith(
        undefined,
        123456,
      );
      expect(loggerSpy).toHaveBeenCalledWith('Mail sending sent', undefined);
    });

    it('should handle missing code in job data', async () => {
      const jobWithMissingCode = {
        ...mockJob,
        data: { code: undefined, email: mockUser.email },
      } as Job;
      jest
        .spyOn(emailService, 'sendSecondFactorCodeEmail')
        .mockResolvedValue(undefined);

      await queue.send(jobWithMissingCode);

      expect(emailService.sendSecondFactorCodeEmail).toHaveBeenCalledWith(
        mockUser.email,
        undefined,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Mail sending sent',
        mockUser.email,
      );
    });

    it('should handle different email addresses', async () => {
      const differentEmail = 'different@example.com';
      const jobWithDifferentEmail = {
        ...mockJob,
        data: { ...mockJobData, email: differentEmail },
      } as Job;
      jest
        .spyOn(emailService, 'sendSecondFactorCodeEmail')
        .mockResolvedValue(undefined);

      await queue.send(jobWithDifferentEmail);

      expect(emailService.sendSecondFactorCodeEmail).toHaveBeenCalledWith(
        differentEmail,
        mockJobData.code,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Mail sending sent',
        differentEmail,
      );
    });

    it('should handle different verification codes', async () => {
      const differentCode = 654321;
      const jobWithDifferentCode = {
        ...mockJob,
        data: { ...mockJobData, code: differentCode },
      } as Job;
      jest
        .spyOn(emailService, 'sendSecondFactorCodeEmail')
        .mockResolvedValue(undefined);

      await queue.send(jobWithDifferentCode);

      expect(emailService.sendSecondFactorCodeEmail).toHaveBeenCalledWith(
        mockJobData.email,
        differentCode,
      );
    });
  });

  describe('onFailed', () => {
    it('should log when job fails', () => {
      const error = new Error('Job failed');

      queue.onFailed(mockJob, error);

      expect(loggerSpy).toHaveBeenCalledWith(
        ` ${mockJob.id} : ${JSON.stringify(error.message)}`,
      );
    });

    it('should handle job failure without id', () => {
      const jobWithoutId = { ...mockJob, id: undefined } as Job;
      const error = new Error('Job failed');

      queue.onFailed(jobWithoutId, error);

      expect(loggerSpy).toHaveBeenCalledWith(
        ` undefined : ${JSON.stringify(error.message)}`,
      );
    });

    it('should handle error without message', () => {
      const errorWithoutMessage = new Error();
      errorWithoutMessage.message = '';

      queue.onFailed(mockJob, errorWithoutMessage);

      expect(loggerSpy).toHaveBeenCalledWith(
        ` ${mockJob.id} : ${JSON.stringify('')}`,
      );
    });

    it('should handle null error', () => {
      expect(() => queue.onFailed(mockJob, null as any)).toThrow();
    });

    it('should handle complex error objects', () => {
      const complexError = {
        name: 'CustomError',
        message: 'Complex error occurred',
        stack: 'Error stack trace...',
      } as any;

      queue.onFailed(mockJob, complexError);

      expect(loggerSpy).toHaveBeenCalledWith(
        ` ${mockJob.id} : ${JSON.stringify(complexError.message)}`,
      );
    });
  });
});
