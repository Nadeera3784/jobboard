import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Location } from '../schemas/location.schema';
import { CreateLocationDto } from '../dtos/create-location.dto';
import { UpdateLocationDto } from '../dtos/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
  ) {}

  /**
   * Retrieves all locations.
   * @returns A promise that resolves to an array of all locations.
   */
  async getAll() {
    return await this.locationModel.find();
  }

  /**
   * Creates a new location with the provided user data.
   * @param CreateLocationDto - Data for creating a new location.
   * @returns A promise that resolves to the created location, or an error if the operation fails.
   */
  async create(createLocationDto: CreateLocationDto) {
    return await this.locationModel.create(createLocationDto);
  }

  /**
   * Retrieves a location by their unique identifier.
   * @param id - The unique identifier of the location to retrieve.
   * @returns A promise that resolves to the location with the specified ID, or null if not found.
   */
  async getById(id: string) {
    return await this.locationModel.findById(id);
  }

  /**
   * Updates an existing location with the provided data.
   * @param id - The unique identifier of the location to update.
   * @param UpdateLocationDto - Data for updating the location.
   * @returns A promise that resolves to the updated location, or null if the location with the specified ID is not found.
   */
  async update(id: string, updateLocationDto: UpdateLocationDto) {
    return await this.locationModel.findByIdAndUpdate(
      { _id: id },
      updateLocationDto,
    );
  }

  /**
   * Deletes a location with the specified ID.
   * @param id - The unique identifier of the location to delete.
   * @returns A promise that resolves to a deletion result indicating success or failure.
   */
  async delete(id: string) {
    return await this.locationModel.deleteOne({
      _id: id,
    });
  }
}
