import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Headers,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecondFactorDto } from '../dtos';
import { ValidateSecondFactorCodeFeature } from '../features';
import { SecondFactorService } from '../services';
import { UserService } from '../../user/services/user.service';

@Controller('2fa')
export class SecondFactorController {
  constructor(
    private readonly validateSecondFactorCodeFeature: ValidateSecondFactorCodeFeature,
    private readonly secondFactorService: SecondFactorService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/auth')
  @HttpCode(HttpStatus.OK)
  public async auth(
    @Body() dto: SecondFactorDto,
    @Headers('authorization') authHeader: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Temporary token is required',
        });
      }

      const tempToken = authHeader.substring(7);

      const payload = await this.jwtService.verifyAsync(tempToken, {
        secret: this.configService.get('app.jwt_key'),
      });

      if (!payload.temp || !payload.userId) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid temporary token',
        });
      }

      const { status, response: featureResponse } =
        await this.validateSecondFactorCodeFeature.handle(
          payload.userId,
          dto,
          request,
        );

      return response.status(status).json(featureResponse);
    } catch (error) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired temporary token',
      });
    }
  }

  @Post('/resend')
  @HttpCode(HttpStatus.OK)
  public async resend(
    @Headers('authorization') authHeader: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Temporary token is required',
        });
      }

      const tempToken = authHeader.substring(7);

      const payload = await this.jwtService.verifyAsync(tempToken, {
        secret: this.configService.get('app.jwt_key'),
      });

      if (!payload.temp || !payload.userId) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid temporary token',
        });
      }

      const user = await this.userService.getById(payload.userId);

      if (!user) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found',
        });
      }

      if (!user.is_two_factor_authentication_enabled) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Two-factor authentication is not enabled for this user',
        });
      }

      await this.secondFactorService.resend(user);

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Verification code resent successfully',
      });
    } catch (error) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired temporary token',
      });
    }
  }
}
