import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import {
  CreateCategoryFeature,
  DatatableFeature,
  DeleteCategoryFeature,
  GetAllCategoriesFeature,
  GetCategoryByIdFeature,
  UpdateCategorynFeature,
} from '../features';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { RolesAllowed } from '../../authentication/decorators/role.decorator';
import { AuthenticationGuard } from '../../authentication/guards/authentication.guard';
import { RoleGuard } from '../../authentication/guards/role.guard';
import { RolesEnum } from '../../user/enums';
import { IdDto } from '../../app/dtos/Id.dto';

@Controller('categories')
@UseGuards(AuthenticationGuard, RoleGuard)
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
  @RolesAllowed(RolesEnum.ADMIN)
  public async getAll(@Res() response: Response) {
    const { status, response: featureUpResponse } =
      await this.getAllCategoriesFeature.handle();
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async getById(@Res() response: Response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.getCategoryByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async create(
    @Res() response: Response,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.createCategoryFeature.handle(createCategoryDto);
    return response.status(status).json(featureUpResponse);
  }

  @Put('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async update(
    @Res() response: Response,
    @Param() { id }: IdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.updateCategorynFeature.handle(id, updateCategoryDto);
    return response.status(status).json(featureUpResponse);
  }

  @Delete('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async delete(@Res() response: Response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.deleteCategoryFeature.handle(id);
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
