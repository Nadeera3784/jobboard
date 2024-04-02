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

import {
  CreateCategoryFeature,
  DatatableFeature,
  DeleteCategoryFeature,
  GetAllCategoriesFeature,
  GetCategoryByIdFeature,
  UpdateCategorynFeature,
} from '../features';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { RolesAllowed } from '../../auth/decorators/role.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../user/enums/roles.enum';

@Controller('categories')
//@UseGuards(AuthGuard, RoleGuard)
export class CategoryController {
  constructor(
    private readonly createCategoryFeature: CreateCategoryFeature,
    private readonly updateCategorynFeature: UpdateCategorynFeature,
    private readonly deleteCategoryFeature: DeleteCategoryFeature,
    private readonly getAllCategoriesFeature: GetAllCategoriesFeature,
    private readonly getCategoryByIdFeature: GetCategoryByIdFeature,
    private readonly datatableFeature: DatatableFeature,
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async getAll(@Res() response) {
    const { status, response: featureUpResponse } =
      await this.getAllCategoriesFeature.handle();
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async getById(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
      await this.getCategoryByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async create(
    @Res() response,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.createCategoryFeature.handle(createCategoryDto);
    return response.status(status).json(featureUpResponse);
  }

  @Put('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async update(
    @Res() response,
    @Param() { id },
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.updateCategorynFeature.handle(id, updateCategoryDto);
    return response.status(status).json(featureUpResponse);
  }

  @Delete('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async delete(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
      await this.deleteCategoryFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Header('Content-Type', 'application/json')
  @Post('/datatable')
  @RolesAllowed(Roles.ADMIN)
  public async dataTable(@Req() request, @Res() response) {
    const { status, response: featureUpResponse } =
      await this.datatableFeature.handle(request);
    return response.status(status).json(featureUpResponse);
  }
}
