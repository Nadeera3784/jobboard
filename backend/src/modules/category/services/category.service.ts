import { Injectable } from '@nestjs/common';
import { Category } from '../schemas/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from "../dtos/createCategory.dto";
import { UpdateCategoryDto } from "../dtos/updateCategory.dto";

@Injectable()
export class CategoryService {

    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>
    ) { }

    /*
     Get the list of category
     @returns Promise<Category[]>
    */
    async getAll() {
        return await this.categoryModel.find();
    }

    /*
     Create 
     @returns Promise<Category>
    */
    async create(createCategoryDto: CreateCategoryDto) {
        return await this.categoryModel.create(createCategoryDto);
    }

    async getById(id: number) {
        return await this.categoryModel.findById(id);
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        return await this.categoryModel.findByIdAndUpdate(
            { _id: id },
            updateCategoryDto,
        );
    }

    async delete(id: number) {
        return await this.categoryModel.deleteOne({
            _id: id
        });
    }
}