import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto , UpdateUserDto} from '../dtos';
import { 
  CreateUserFeature, 
  DatatableFeature, 
  DeleteUserFeature, 
  GetAllUsersFeature, 
  GetUserByIdFeature, 
  UpdateUserFeature 
} from '../features';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../enums';
import { RolesAllowed } from '../../auth/decorators/role.decorator';

@Controller('users')
//@UseGuards(AuthGuard, RoleGuard)
export class UserController {
  constructor(
    private readonly deleteUserFeature: DeleteUserFeature,
    private readonly getAllUsersFeature: GetAllUsersFeature,
    private readonly getUserByIdFeature: GetUserByIdFeature,
    private readonly createUserFeature: CreateUserFeature,
    private readonly updateUserFeature: UpdateUserFeature,
    private readonly datatableFeature: DatatableFeature
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async getAll(@Res() response) {
    const { status, response: featureUpResponse } =
      await this.getAllUsersFeature.handle();
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async getById(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
      await this.getUserByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async create(@Res() response, @Body() createUserDto: CreateUserDto) {
    const { status, response: featureUpResponse } =
      await this.createUserFeature.handle(createUserDto);
    return response.status(status).json(featureUpResponse);
  }

  @Put('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async update(
    @Res() response,
    @Param() { id },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.updateUserFeature.handle(id, updateUserDto);
    return response.status(status).json(featureUpResponse);
  }

  @Delete('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async delete(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
      await this.deleteUserFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Header('Content-Type', 'application/json')
  @Post('/datatable')
  @RolesAllowed(Roles.ADMIN)
  public async dataTable(@Req() request, @Res() response){
    const { status, response: featureUpResponse } =
    await this.datatableFeature.handle(request);
    return response.status(status).json(featureUpResponse);
  }

}
