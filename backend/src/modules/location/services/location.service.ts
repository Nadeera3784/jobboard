import { Injectable } from '@nestjs/common';
import { Location } from '../schemas/location.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

    async getById(id: number) {
        return await this.locationModel.findById(id);
    }

    async update(id: number, updateLocationDto: UpdateLocationDto) {
        return await this.locationModel.findByIdAndUpdate(
            { _id: id },
            updateLocationDto,
        );
    }

    async delete(id: number) {
        return await this.locationModel.deleteOne({
            _id: id
        });
    }
}