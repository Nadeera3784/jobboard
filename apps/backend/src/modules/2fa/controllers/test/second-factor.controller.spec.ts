import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

import { SecondFactorController } from '../second-factor.controller';
import { ValidateSecondFactorCodeFeature } from '../../features';
import { SecondFactorService } from '../../services';
import { UserService } from '../../../user/services/user.service';
import { SecondFactorDto } from '../../dtos';
import { RolesEnum } from '../../../user/enums';
import { SharedStatus } from '../../../app/enums/shared-status.enum';

describe('SecondFactorController', () => {
  let controller: SecondFactorController;
  let validateFeature: ValidateSecondFactorCodeFeature;
  let secondFactorService: SecondFactorService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

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
  } as unknown as any;

  const mockJwtPayload = {
    temp: true,
    userId: mockUser._id,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecondFactorController],
      providers: [
        {
          provide: ValidateSecondFactorCodeFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: SecondFactorService,
          useValue: {
            resend: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-jwt-secret'),
          },
        },
      ],
    }).compile();

    controller = module.get<SecondFactorController>(SecondFactorController);
    validateFeature = module.get<ValidateSecondFactorCodeFeature>(
      ValidateSecondFactorCodeFeature,
    );
    secondFactorService = module.get<SecondFactorService>(SecondFactorService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('auth', () => {
    let request: MockRequest<Request>;
    let response: MockResponse<Response>;
    let dto: SecondFactorDto;

    beforeEach(() => {
      request = createRequest();
      response = createResponse();
      dto = { secondFactorCode: 123456 };

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn().mockReturnThis();
    });

    it('should authenticate successfully with valid token and code', async () => {
      const authHeader = 'Bearer valid-temp-token';

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockJwtPayload);
      jest.spyOn(validateFeature, 'handle').mockResolvedValue({
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'Two-factor authentication successful',
          data: {
            type: 'Bearer',
            access_token: 'access-token',
            redirect_identifier: RolesEnum.USER,
          },
        },
      });

      await controller.auth(dto, authHeader, request, response);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-temp-token', {
        secret: 'test-jwt-secret',
      });
      expect(validateFeature.handle).toHaveBeenCalledWith(
        mockJwtPayload.userId,
        dto,
        request,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should return 401 when authorization header is missing', async () => {
      await controller.auth(dto, undefined, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Temporary token is required',
      });
    });

    it('should return 401 when authorization header does not start with Bearer', async () => {
      const authHeader = 'Basic invalid-token';

      await controller.auth(dto, authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Temporary token is required',
      });
    });

    it('should return 401 when JWT verification fails', async () => {
      const authHeader = 'Bearer invalid-token';

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      await controller.auth(dto, authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired temporary token',
      });
    });

    it('should return 401 when JWT payload is invalid (missing temp flag)', async () => {
      const authHeader = 'Bearer valid-token';
      const invalidPayload = { userId: mockUser._id }; // Missing temp: true

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(invalidPayload);

      await controller.auth(dto, authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid temporary token',
      });
    });

    it('should return 401 when JWT payload is invalid (missing userId)', async () => {
      const authHeader = 'Bearer valid-token';
      const invalidPayload = { temp: true }; // Missing userId

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(invalidPayload);

      await controller.auth(dto, authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid temporary token',
      });
    });

    it('should handle validation feature errors', async () => {
      const authHeader = 'Bearer valid-temp-token';

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockJwtPayload);
      jest.spyOn(validateFeature, 'handle').mockResolvedValue({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid code',
          data: null,
        },
      });

      await controller.auth(dto, authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid code',
        data: null,
      });
    });
  });

  describe('resend', () => {
    let request: MockRequest<Request>;
    let response: MockResponse<Response>;

    beforeEach(() => {
      request = createRequest();
      response = createResponse();

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn().mockReturnThis();
    });

    it('should resend verification code successfully', async () => {
      const authHeader = 'Bearer valid-temp-token';

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockJwtPayload);
      jest.spyOn(userService, 'getById').mockResolvedValue(mockUser);
      jest.spyOn(secondFactorService, 'resend').mockResolvedValue();

      await controller.resend(authHeader, request, response);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-temp-token', {
        secret: 'test-jwt-secret',
      });
      expect(userService.getById).toHaveBeenCalledWith(mockJwtPayload.userId);
      expect(secondFactorService.resend).toHaveBeenCalledWith(mockUser);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Verification code resent successfully',
      });
    });

    it('should return 401 when authorization header is missing', async () => {
      await controller.resend(undefined, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Temporary token is required',
      });
    });

    it('should return 401 when authorization header is invalid', async () => {
      const authHeader = 'Basic invalid-token';

      await controller.resend(authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Temporary token is required',
      });
    });

    it('should return 401 when JWT verification fails', async () => {
      const authHeader = 'Bearer invalid-token';

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      await controller.resend(authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired temporary token',
      });
    });

    it('should return 401 when JWT payload is invalid', async () => {
      const authHeader = 'Bearer valid-token';
      const invalidPayload = { userId: mockUser._id }; // Missing temp: true

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(invalidPayload);

      await controller.resend(authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid temporary token',
      });
    });

    it('should return 400 when user is not found', async () => {
      const authHeader = 'Bearer valid-temp-token';

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockJwtPayload);
      jest.spyOn(userService, 'getById').mockResolvedValue(null);

      await controller.resend(authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User not found',
      });
    });

    it('should return 400 when user has 2FA disabled', async () => {
      const authHeader = 'Bearer valid-temp-token';
      const userWith2FADisabled = {
        ...mockUser,
        is_two_factor_authentication_enabled: false,
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockJwtPayload);
      jest.spyOn(userService, 'getById').mockResolvedValue(userWith2FADisabled);

      await controller.resend(authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Two-factor authentication is not enabled for this user',
      });
    });

    it('should handle service errors gracefully', async () => {
      const authHeader = 'Bearer valid-temp-token';

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockJwtPayload);
      jest.spyOn(userService, 'getById').mockResolvedValue(mockUser);
      jest
        .spyOn(secondFactorService, 'resend')
        .mockRejectedValue(new Error('Service error'));

      await controller.resend(authHeader, request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired temporary token',
      });
    });
  });
});
