import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ObjectId } from 'mongoose';

import { ValidateSecondFactorCodeFeature } from '../validate-second-factor-code.feature';
import { UserService } from '../../../user/services/user.service';
import { SecondFactorService } from '../../services';
import { EventDispatcher } from '../../../core/event-dispatcher';
import { SuspiciousActivityService } from '../../../brute-force/services/suspicious-activity.service';
import { SecondFactorDto } from '../../dtos';
import { RolesEnum } from '../../../user/enums';
import { SharedStatus } from '../../../app/enums/shared-status.enum';

describe('ValidateSecondFactorCodeFeature', () => {
  let feature: ValidateSecondFactorCodeFeature;
  let userService: UserService;
  let secondFactorService: SecondFactorService;
  let jwtService: JwtService;
  let suspiciousActivityService: SuspiciousActivityService;
  let eventDispatcher: EventDispatcher;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011' as unknown as ObjectId,
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
  } as unknown as any;

  const mockRequest = {} as Request;
  const mockDto: SecondFactorDto = { secondFactorCode: 123456 };
  const mockAccessToken = 'mock-access-token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateSecondFactorCodeFeature,
        {
          provide: UserService,
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: SecondFactorService,
          useValue: {
            validate: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: SuspiciousActivityService,
          useValue: {
            removeUserFromBlockList: jest.fn(),
            clearLoginFailures: jest.fn(),
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

    feature = module.get<ValidateSecondFactorCodeFeature>(
      ValidateSecondFactorCodeFeature,
    );
    userService = module.get<UserService>(UserService);
    secondFactorService = module.get<SecondFactorService>(SecondFactorService);
    jwtService = module.get<JwtService>(JwtService);
    suspiciousActivityService = module.get<SuspiciousActivityService>(
      SuspiciousActivityService,
    );
    eventDispatcher = module.get<EventDispatcher>(EventDispatcher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(feature).toBeDefined();
  });

  describe('handle', () => {
    it('should successfully validate 2FA code and return access token', async () => {
      jest.spyOn(userService, 'getById').mockResolvedValue(mockUser);
      jest.spyOn(secondFactorService, 'validate').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockAccessToken);
      jest
        .spyOn(suspiciousActivityService, 'removeUserFromBlockList')
        .mockResolvedValue(undefined);
      jest
        .spyOn(suspiciousActivityService, 'clearLoginFailures')
        .mockResolvedValue(undefined);
      jest.spyOn(eventDispatcher, 'dispatch').mockResolvedValue(undefined);

      const result = await feature.handle(
        mockUser._id.toString(),
        mockDto,
        mockRequest,
      );

      expect(userService.getById).toHaveBeenCalledWith(mockUser._id.toString());
      expect(secondFactorService.validate).toHaveBeenCalledWith(
        mockUser._id.toString(),
        mockDto.secondFactorCode,
        mockRequest,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser._id });
      expect(
        suspiciousActivityService.removeUserFromBlockList,
      ).toHaveBeenCalledWith(mockUser._id.toString());
      expect(suspiciousActivityService.clearLoginFailures).toHaveBeenCalledWith(
        mockUser._id.toString(),
        null,
      );

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBe(
        'Two-factor authentication successful',
      );
      expect(result.response.data).toEqual({
        type: 'Bearer',
        access_token: mockAccessToken,
        redirect_identifier: mockUser.role,
      });
    });

    it('should return error when user is not found', async () => {
      jest.spyOn(userService, 'getById').mockResolvedValue(null);

      const result = await feature.handle(
        mockUser._id.toString(),
        mockDto,
        mockRequest,
      );

      expect(userService.getById).toHaveBeenCalledWith(mockUser._id.toString());
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe('User not found');
      expect(result.response.data).toBeNull();
    });

    it('should return error when 2FA is not enabled for user', async () => {
      const userWith2FADisabled = {
        ...mockUser,
        is_two_factor_authentication_enabled: false,
      };

      jest.spyOn(userService, 'getById').mockResolvedValue(userWith2FADisabled);

      const result = await feature.handle(
        mockUser._id.toString(),
        mockDto,
        mockRequest,
      );

      expect(userService.getById).toHaveBeenCalledWith(mockUser._id.toString());
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Two-factor authentication is not enabled for this user',
      );
      expect(result.response.data).toBeNull();
    });

    it('should return error when validation fails', async () => {
      jest.spyOn(userService, 'getById').mockResolvedValue(mockUser);
      jest.spyOn(secondFactorService, 'validate').mockResolvedValue(false);

      const result = await feature.handle(
        mockUser._id.toString(),
        mockDto,
        mockRequest,
      );

      expect(userService.getById).toHaveBeenCalledWith(mockUser._id.toString());
      expect(secondFactorService.validate).toHaveBeenCalledWith(
        mockUser._id.toString(),
        mockDto.secondFactorCode,
        mockRequest,
      );
      expect(result.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(result.response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(result.response.message).toBe(
        'Invalid two-factor authentication code',
      );
      expect(result.response.data).toBeNull();
    });

    it('should handle validation service exceptions', async () => {
      jest.spyOn(userService, 'getById').mockResolvedValue(mockUser);
      jest
        .spyOn(secondFactorService, 'validate')
        .mockRejectedValue(new Error('Validation service error'));

      const result = await feature.handle(
        mockUser._id.toString(),
        mockDto,
        mockRequest,
      );

      expect(userService.getById).toHaveBeenCalledWith(mockUser._id.toString());
      expect(secondFactorService.validate).toHaveBeenCalledWith(
        mockUser._id.toString(),
        mockDto.secondFactorCode,
        mockRequest,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle user service errors', async () => {
      jest
        .spyOn(userService, 'getById')
        .mockRejectedValue(new Error('User service error'));

      const result = await feature.handle(
        mockUser._id.toString(),
        mockDto,
        mockRequest,
      );

      expect(userService.getById).toHaveBeenCalledWith(mockUser._id.toString());
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle JWT signing errors', async () => {
      jest.spyOn(userService, 'getById').mockResolvedValue(mockUser);
      jest.spyOn(secondFactorService, 'validate').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw new Error('JWT signing error');
      });

      const result = await feature.handle(
        mockUser._id.toString(),
        mockDto,
        mockRequest,
      );

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle suspicious activity service errors gracefully', async () => {
      jest.spyOn(userService, 'getById').mockResolvedValue(mockUser);
      jest.spyOn(secondFactorService, 'validate').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockAccessToken);
      jest
        .spyOn(suspiciousActivityService, 'removeUserFromBlockList')
        .mockRejectedValue(new Error('Suspicious activity service error'));
      jest
        .spyOn(suspiciousActivityService, 'clearLoginFailures')
        .mockResolvedValue(undefined);
      jest.spyOn(eventDispatcher, 'dispatch').mockResolvedValue(undefined);

      const result = await feature.handle(
        mockUser._id.toString(),
        mockDto,
        mockRequest,
      );

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle event dispatcher errors gracefully', async () => {
      jest.spyOn(userService, 'getById').mockResolvedValue(mockUser);
      jest.spyOn(secondFactorService, 'validate').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockAccessToken);
      jest
        .spyOn(suspiciousActivityService, 'removeUserFromBlockList')
        .mockResolvedValue();
      jest
        .spyOn(suspiciousActivityService, 'clearLoginFailures')
        .mockResolvedValue();
      jest.spyOn(eventDispatcher, 'dispatch').mockImplementation(() => {
        throw new Error('Event dispatcher error');
      });

      const result = await feature.handle(
        mockUser._id.toString(),
        mockDto,
        mockRequest,
      );

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle different user roles correctly', async () => {
      const adminUser = {
        ...mockUser,
        role: RolesEnum.ADMIN,
      };

      jest.spyOn(userService, 'getById').mockResolvedValue(adminUser);
      jest.spyOn(secondFactorService, 'validate').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockAccessToken);
      jest
        .spyOn(suspiciousActivityService, 'removeUserFromBlockList')
        .mockResolvedValue(undefined);
      jest
        .spyOn(suspiciousActivityService, 'clearLoginFailures')
        .mockResolvedValue(undefined);
      jest.spyOn(eventDispatcher, 'dispatch').mockResolvedValue(undefined);

      const result = await feature.handle(
        adminUser._id.toString(),
        mockDto,
        mockRequest,
      );

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.data.redirect_identifier).toBe(RolesEnum.ADMIN);
    });

    it('should handle invalid user ID format', async () => {
      const invalidUserId = 'invalid-user-id';

      jest.spyOn(userService, 'getById').mockResolvedValue(null);

      const result = await feature.handle(invalidUserId, mockDto, mockRequest);

      expect(userService.getById).toHaveBeenCalledWith(invalidUserId);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe('User not found');
      expect(result.response.data).toBeNull();
    });

    it('should handle invalid 2FA code', async () => {
      const invalidDto: SecondFactorDto = { secondFactorCode: 999999 };

      jest.spyOn(userService, 'getById').mockResolvedValue(mockUser);
      jest.spyOn(secondFactorService, 'validate').mockResolvedValue(false);

      const result = await feature.handle(
        mockUser._id.toString(),
        invalidDto,
        mockRequest,
      );

      expect(secondFactorService.validate).toHaveBeenCalledWith(
        mockUser._id.toString(),
        invalidDto.secondFactorCode,
        mockRequest,
      );
      expect(result.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(result.response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(result.response.message).toBe(
        'Invalid two-factor authentication code',
      );
      expect(result.response.data).toBeNull();
    });
  });
});
