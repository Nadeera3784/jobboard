import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { CategorySchema, Category } from './schemas/category.schema';
import { CreateCategoryFeature } from './features/create-category.feature';
import { UpdateCategorynFeature } from './features/update-category-feature';
import { DeleteCategoryFeature } from './features/delete-category.feature';
import { GetAllCategoriesFeature } from './features/get-all-categories.feature';
import { GetCategoryByIdFeature } from './features/get-category-by-id.feature';
import { DatatableFeature } from './features/datatable.feature';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    UserModule
  ],
  providers: [
    CategoryService,
    CreateCategoryFeature,
    UpdateCategorynFeature,
    DeleteCategoryFeature,
    GetAllCategoriesFeature,
    GetCategoryByIdFeature,
    DatatableFeature
  ],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
