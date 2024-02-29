import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { response } from 'express';
import { Response as ResponseType } from '../../app/enums/response.enum';
import { CreateLocationDto } from "../dtos/create-location.dto";
import { UpdateLocationDto } from "../dtos/update-location.dto";

@Controller('locations')
export class LocationController {

    constructor(
        private readonly locationService: LocationService
    ) { }

    @Get()
    public async getAll(
        @Res() response
    ) {
        try {
            const categories = await this.locationService.getAll();
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
            const category = await this.locationService.getById(id);
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
    public async create(@Res() response, @Body() createLocationDto: CreateLocationDto) {
        try {
            const location = await this.locationService.create(createLocationDto);
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: 'Location has been created successfully',
                data: location,
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
        @Body() updateLocationDto: UpdateLocationDto,
    ) {
        try {
            const location = await this.locationService.update(id, updateLocationDto);
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: 'Location has been updated successfully',
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
            await this.locationService.delete(id);
            return response.status(HttpStatus.OK).json({
                type: ResponseType.SUCCESS,
                message: 'Location has been deleted successfully',
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
