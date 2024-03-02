import { HttpStatus, Injectable} from '@nestjs/common';

@Injectable()
export class BaseFeature {

  protected async responseSuccess(status: number = HttpStatus.OK, type: string = 'SUCCESS', message: string = 'Operation successful', data: any = null) {
    return {
      status: status,
      response: {
        type: type,
        message: message,
        data: data,
      },
    };
  }

  protected async responseError(status: number = HttpStatus.BAD_REQUEST, type: string = 'ERROR', message: string = 'Something went wrong, Please try again later', error: any = null) {
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
