import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class BaseFeature {
  protected async responseSuccess(
    status: number = HttpStatus.OK,
    type = 'SUCCESS',
    message = 'Operation successful',
    data: any = null,
  ) {
    return {
      status: status,
      response: {
        type: type,
        message: message,
        data: data,
      },
    };
  }

  protected async responseError(
    status: number = HttpStatus.BAD_REQUEST,
    type = 'ERROR',
    message = 'Something went wrong, Please try again later',
    error: any = null,
  ) {
    return {
      status: status,
      response: {
        type: type,
        message: message,
        data: error,
      },
    };
  }
}
