import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Location } from '../schemas/location.schema';
import { CreateLocationDto } from "../dtos/create-location.dto";
import { UpdateLocationDto } from "../dtos/update-location.dto";

@Injectable()
export class LocationService {

    constructor(
        @InjectModel(Location.name) private readonly locationModel: Model<Location>
    ) { }

    
    async getAll() {
        return await this.locationModel.find();
    }

    async create(createLocationDto: CreateLocationDto) {
        return await this.locationModel.create(createLocationDto);
    }

    async getById(id: string) {
        return await this.locationModel.findById(id);
    }

    async update(id: string, updateLocationDto: UpdateLocationDto) {
        return await this.locationModel.findByIdAndUpdate(
            { _id: id },
            updateLocationDto,
        );
    }

    async delete(id: string) {
        return await this.locationModel.deleteOne({
            _id: id
        });
    }
}