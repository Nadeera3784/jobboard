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

import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CreateCategoryFeature } from '../features/create-category-feature';
import { UpdateCategorynFeature } from '../features/update-category-feature';
import { DeleteCategoryFeature } from '../features/delete-category-feature';
import { GetAllCategoriesFeature } from '../features/get-all-categories-features';
import { GetCategoryByIdFeature } from '../features/get-category-by-id-feature';
import { RolesAllowed } from '../../auth/decorators/role.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../user/enums/roles.enum';

@Controller('categories')
@UseGuards(AuthGuard, RoleGuard)
export class CategoryController {
  constructor(
    private readonly createCategoryFeature: CreateCategoryFeature,
    private readonly updateCategorynFeature: UpdateCategorynFeature,
    private readonly deleteCategoryFeature: DeleteCategoryFeature,
    private readonly getAllCategoriesFeature: GetAllCategoriesFeature,
    private readonly getCategoryByIdFeature: GetCategoryByIdFeature
    ) {}

  @Get()
  @RolesAllowed(Roles.ADMIN)
  public async getAll(@Res() response) {
    const { status, response: featureUpResponse } =
    await this.getAllCategoriesFeature.handle();
  return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  @RolesAllowed(Roles.ADMIN)
  public async getById(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
      await this.getCategoryByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
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
  @RolesAllowed(Roles.ADMIN)
  public async delete(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
    await this.deleteCategoryFeature.handle(id);
  return response.status(status).json(featureUpResponse);
  }
}
