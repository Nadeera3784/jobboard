import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Response as ResponseType } from '../../app/enums/response.enum';
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Get()
    public async getAll(
        @Res() response
    ) {
        try {
            const users = await this.userService.getAll();
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: null,
                data: users || [],
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
            const category = await this.userService.getById(id);
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
    public async create(@Res() response, @Body() createUserDto: CreateUserDto) {
        try {
            await this.userService.create(createUserDto);
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: 'User has been created successfully',
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

    @Put('/:id')
    public async update(
        @Res() response,
        @Param() { id },
        @Body() updateUserDto: UpdateUserDto,
    ) {
        try {
            await this.userService.update(id, updateUserDto);
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: 'User has been updated successfully',
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
            await this.userService.delete(id);
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: 'User has been deleted successfully',
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
