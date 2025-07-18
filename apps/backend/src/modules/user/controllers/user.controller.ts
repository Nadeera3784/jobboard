import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Response } from 'express';

import { CreateUserDto, UpdateUserDto, UpdateUserSettingsDto } from '../dtos';
import {
  CreateUserFeature,
  DatatableFeature,
  DeleteUserFeature,
  GetAllUsersFeature,
  GetUserByIdFeature,
  UpdateUserFeature,
} from '../features';
import { UpdateUserSettingsFeature } from '../features/update-user-settings.feature';
import { AuthenticationGuard } from '../../authentication/guards/authentication.guard';
import { RoleGuard } from '../../authentication/guards/role.guard';
import { RolesEnum } from '../enums';
import { RolesAllowed } from '../../authentication/decorators/role.decorator';
import { IdDto } from '../../app/dtos/Id.dto';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express/multer';

@Controller('users')
@UseGuards(AuthenticationGuard, RoleGuard)
export class UserController {
  constructor(
    private readonly deleteUserFeature: DeleteUserFeature,
    private readonly getAllUsersFeature: GetAllUsersFeature,
    private readonly getUserByIdFeature: GetUserByIdFeature,
    private readonly createUserFeature: CreateUserFeature,
    private readonly updateUserFeature: UpdateUserFeature,
    private readonly updateUserSettingsFeature: UpdateUserSettingsFeature,
    private readonly datatableFeature: DatatableFeature,
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async getAll(@Res() response: Response) {
    const { status, response: featureUpResponse } =
      await this.getAllUsersFeature.handle();
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async getById(@Res() response: Response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.getUserByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
  @RolesAllowed(RolesEnum.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  public async create(
    @Res() response: Response,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1000000 })
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.createUserFeature.handle(createUserDto, file);
    return response.status(status).json(featureUpResponse);
  }

  @Put('/user-settings')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.USER, RolesEnum.COMPANY)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'resume', maxCount: 1 },
    ]),
  )
  public async updateUserSettings(
    @Req() request,
    @Res() response: Response,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; resume?: Express.Multer.File[] },
  ) {
    // Validate files if present
    const imageFile = files?.image?.[0];
    const resumeFile = files?.resume?.[0];

    // Validate image file
    if (imageFile) {
      if (imageFile.size > 1000000) {
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: 'Image file size must be less than 1MB',
        });
      }
      if (
        !['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(
          imageFile.mimetype,
        )
      ) {
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: 'Image must be a valid image file (PNG, JPEG, JPG, or WebP)',
        });
      }
    }

    // Validate resume file
    if (resumeFile) {
      if (resumeFile.size > 5000000) {
        // 5MB limit for resume
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: 'Resume file size must be less than 5MB',
        });
      }
      if (resumeFile.mimetype !== 'application/pdf') {
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: 'Resume must be a PDF file',
        });
      }
    }

    const { status, response: featureUpResponse } =
      await this.updateUserSettingsFeature.handle(
        request.user.id,
        updateUserSettingsDto,
        imageFile,
        resumeFile,
      );
    return response.status(status).json(featureUpResponse);
  }

  @Put('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async update(
    @Res() response: Response,
    @Param() { id }: IdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.updateUserFeature.handle(id, updateUserDto);
    return response.status(status).json(featureUpResponse);
  }

  @Delete('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async delete(@Res() response: Response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.deleteUserFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/datatable')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async dataTable(
    @Res() response: Response,
    @Body('order') order: any,
    @Body('columns') columns: any,
    @Body('filters') filters: any,
    @Body('search') search: string,
    @Body('limit') limit: number,
    @Body('start') start: number,
  ) {
    const { status, response: featureUpResponse } =
      await this.datatableFeature.handle(
        order,
        columns,
        filters,
        search,
        limit,
        start,
      );
    return response.status(status).json(featureUpResponse);
  }
}
