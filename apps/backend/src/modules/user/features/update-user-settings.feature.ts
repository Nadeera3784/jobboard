import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { UserService } from '../services/user.service';
import { UpdateUserSettingsDto } from '../dtos/update-user-settings.dto';
import { FilesystemService } from '../../core/file-system';

@Injectable()
export class UpdateUserSettingsFeature extends Feature {
  constructor(
    private readonly userService: UserService,
    private readonly filesystemService: FilesystemService,
  ) {
    super();
  }

  public async handle(
    userId: string,
    updateUserSettingsDto: UpdateUserSettingsDto,
    imageFile?: Express.Multer.File,
    resumeFile?: Express.Multer.File,
  ) {
    try {
      if (imageFile) {
        const uploadedFile = await this.filesystemService.put(
          imageFile.originalname,
          imageFile.buffer,
          {
            mimeType: imageFile.mimetype,
          },
        );
        updateUserSettingsDto.image = {
          key: uploadedFile.path,
          value: uploadedFile.url,
        };
      }

      if (resumeFile) {
        const uploadedFile = await this.filesystemService.put(
          resumeFile.originalname,
          resumeFile.buffer,
          {
            mimeType: resumeFile.mimetype,
          },
        );
        updateUserSettingsDto.resume = {
          key: uploadedFile.path,
          value: uploadedFile.url,
        };
      }

      await this.userService.updateSettings(userId, updateUserSettingsDto);
      return this.responseSuccess(
        HttpStatus.OK,
        'User settings have been updated successfully',
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
