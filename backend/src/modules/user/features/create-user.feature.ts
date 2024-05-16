import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FilesystemService } from '../../core/file-system';

@Injectable()
export class CreateUserFeature extends BaseFeature {
  constructor(
    private readonly userService: UserService,
    private readonly filesystemService: FilesystemService,
  ) {
    super();
  }

  public async handle(
    createUserDto: CreateUserDto,
    file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        const uploadedFile = await this.filesystemService.put(
          file.originalname,
          file.buffer,
          {
            mimeType: file.mimetype,
          },
        );
        createUserDto.image = {
          key: uploadedFile.path,
          value: uploadedFile.url,
        };
      }

      await this.userService.create(createUserDto);
      return this.responseSuccess(
        HttpStatus.OK,
        'User has been created successfully',
      );
    } catch (error) {
      console.log('ERROR', error);
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
