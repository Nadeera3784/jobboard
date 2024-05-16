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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto } from '../dtos';
import {
  CreateUserFeature,
  DatatableFeature,
  DeleteUserFeature,
  GetAllUsersFeature,
  GetUserByIdFeature,
  UpdateUserFeature,
} from '../features';
import { AuthenticationGuard } from '../../authentication/guards/authentication.guard';
import { RoleGuard } from '../../authentication/guards/role.guard';
import { RolesEnum } from '../enums';
import { RolesAllowed } from '../../authentication/decorators/role.decorator';
import { IdDto } from '../../app/dtos/Id.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller('users')
@UseGuards(AuthenticationGuard, RoleGuard)
export class UserController {
  constructor(
    private readonly deleteUserFeature: DeleteUserFeature,
    private readonly getAllUsersFeature: GetAllUsersFeature,
    private readonly getUserByIdFeature: GetUserByIdFeature,
    private readonly createUserFeature: CreateUserFeature,
    private readonly updateUserFeature: UpdateUserFeature,
    private readonly datatableFeature: DatatableFeature,
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async getAll(@Res() response) {
    const { status, response: featureUpResponse } =
      await this.getAllUsersFeature.handle();
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async getById(@Res() response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.getUserByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
  @RolesAllowed(RolesEnum.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  public async create(
    @Res() response,
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

  @Put('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async update(
    @Res() response,
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
  public async delete(@Res() response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.deleteUserFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/datatable')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async dataTable(
    @Res() response,
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
