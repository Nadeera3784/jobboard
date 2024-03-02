import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';

import { CategoryService } from '../services/category.service';
import { Response as ResponseType } from '../../app/enums/response.enum';
import { CreateCategoryDto } from "../dtos/create-category.dto";
import { UpdateCategoryDto } from "../dtos/update-category.dto";

@Controller('categories')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Get()
    public async getAll(
        @Res() response
    ) {
        try {
            const categories = await this.categoryService.getAll();
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: null,
                data: categories || [],
            });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                type: ResponseType.ERROR,
                message: 'Something went wrong, Please try again later',
                data: null,
            });
        }
    }

    @Get('/:id')
    public async getById(@Res() response, @Param() { id }) {
        try {
            const category = await this.categoryService.getById(id);
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: null,
                data: category,
            });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                type: ResponseType.ERROR,
                message: 'Something went wrong, Please try again later',
                data: null,
            });
        }
    }

    @Post()
    public async create(@Res() response, @Body() createCategoryDto: CreateCategoryDto) {
        try {
            const category = await this.categoryService.create(createCategoryDto);
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: 'Category has been created successfully',
                data: category,
            });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                type: ResponseType.ERROR,
                message: 'Something went wrong, Please try again later',
                data: null,
            });
        }
    }

    @Put('/:id')
    public async update(
        @Res() response,
        @Param() { id },
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        try {
            const category = await this.categoryService.update(id, updateCategoryDto);
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: 'Category has been updated successfully',
                data: null,
            });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                type: ResponseType.ERROR,
                message: 'Something went wrong, Please try again later',
                data: null,
            });
        }
    }

    @Delete('/:id')
    public async delete(@Res() response, @Param() { id }) {
        try {
            await this.categoryService.delete(id);
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: 'Category has been deleted successfully',
                data: null,
            });
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                type: ResponseType.ERROR,
                message: 'Something went wrong, Please try again later',
                data: null,
            });
        }
    }

}
