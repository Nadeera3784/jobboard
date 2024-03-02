import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category } from '../schemas/category.schema';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  /**
   * Retrieves all categories.
   * @returns A promise that resolves to an array of all categories.
   */
  async getAll() {
    return await this.categoryModel.find();
  }

  /**
   * Creates a new category with the provided user data.
   * @param CreateCategoryDto - Data for creating a new category.
   * @returns A promise that resolves to the created category, or an error if the operation fails.
   */
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryModel.create(createCategoryDto);
  }

  /**
   * Retrieves a category by their unique identifier.
   * @param id - The unique identifier of the category to retrieve.
   * @returns A promise that resolves to the category with the specified ID, or null if not found.
   */
  async getById(id: string) {
    return await this.categoryModel.findById(id);
  }

  /**
   * Updates an existing category with the provided data.
   * @param id - The unique identifier of the category to update.
   * @param UpdateCategoryDto - Data for updating the category.
   * @returns A promise that resolves to the updated category, or null if the category with the specified ID is not found.
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryModel.findByIdAndUpdate(
      { _id: id },
      updateCategoryDto,
    );
  }

  /**
   * Deletes a category with the specified ID.
   * @param id - The unique identifier of the category to delete.
   * @returns A promise that resolves to a deletion result indicating success or failure.
   */
  async delete(id: string) {
    return await this.categoryModel.deleteOne({
      _id: id,
    });
  }
}
