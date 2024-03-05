import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { DeleteUserFeature } from '../features/delete-user-feature';
import { GetAllUsersFeature } from '../features/get-all-users-features';
import { GetUserByIdFeature } from '../features/get-user-by-id-feature';
import { CreateUserFeature } from '../features/create-user-feature';
import { UpdateUserFeature } from '../features/update-user-feature';
import { RolesAllowed } from '../../auth/decorators/role.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../enums/roles.enum';

@Controller('users')
@UseGuards(AuthGuard, RoleGuard)
export class UserController {
  constructor(
    private readonly deleteUserFeature: DeleteUserFeature,
    private readonly getAllUsersFeature: GetAllUsersFeature,
    private readonly getUserByIdFeature: GetUserByIdFeature,
    private readonly createUserFeature: CreateUserFeature,
    private readonly updateUserFeature: UpdateUserFeature,
  ) {}

  @Get()
  @RolesAllowed(Roles.ADMIN)
  public async getAll(@Res() response) {
    const { status, response: featureUpResponse } =
      await this.getAllUsersFeature.handle();
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  @RolesAllowed(Roles.ADMIN)
  public async getById(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
      await this.getUserByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
  @RolesAllowed(Roles.ADMIN)
  public async create(@Res() response, @Body() createUserDto: CreateUserDto) {
    const { status, response: featureUpResponse } =
      await this.createUserFeature.handle(createUserDto);
    return response.status(status).json(featureUpResponse);
  }

  @Put('/:id')
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
  @RolesAllowed(Roles.ADMIN)
  public async delete(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
      await this.deleteUserFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }
}
