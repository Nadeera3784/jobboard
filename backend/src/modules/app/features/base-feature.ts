import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class BaseFeature {
  protected async responseSuccess(
    status: number = HttpStatus.OK,
    message = 'Operation successful',
    data: any = null,
  ) {
    return {
      status: status,
      response: {
        statusCode: status,
        message: message,
        data: data,
      },
    };
  }

  protected async responseError(
    status: number = HttpStatus.BAD_REQUEST,
    message = 'Something went wrong, Please try again later',
    data: any = null,
  ) {
    return {
      status: status,
      response: {
        
        statusCode: status,
        message: message,
        data: data,
      },
    };
  }
}
