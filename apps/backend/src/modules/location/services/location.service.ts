import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { Location } from '../schemas/location.schema';
import { CreateLocationDto, UpdateLocationDto } from '../dtos';
import { LocationStatusEnum } from '../enums';
import { ModelService } from '../../app/services';

@Injectable()
export class LocationService extends ModelService<Location> {
  constructor(
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
    private configService: ConfigService,
  ) {
    super();
  }

  /**
   * Retrieves all locations.
   * @returns A promise that resolves to an array of all locations.
   */
  async getAll() {
    return await this.locationModel.find({ status: LocationStatusEnum.ACTIVE });
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

  async datatable(
    order,
    columns,
    filters,
    search: string,
    limit: number,
    start: number,
  ) {
    try {
      let searchQuery: any = {};
      let sort: any = { created_at: -1 };
      let recordsTotal = 0;
      let recordsFiltered = 0;
      const whereQuery: any = {};

      if (filters.status) {
        whereQuery.status = filters.status;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        searchQuery = {
          $or: [{ name: regex }],
        };
      }

      searchQuery = { ...searchQuery, ...whereQuery };

      if (order.length && columns.length) {
        const sortByOrder: any = order.reduce((memo: any, ordr: any) => {
          const column = columns[ordr.column];
          memo[ordr.name] = ordr.dir === 'asc' ? 1 : -1;
          return memo;
        }, {});

        if (Object.keys(sortByOrder).length) {
          sort = sortByOrder;
        }
      }

      recordsTotal = await this.locationModel.countDocuments({});

      recordsFiltered = await this.locationModel.countDocuments(searchQuery);

      let results = await this.locationModel
        .find(searchQuery, 'name')
        .select('_id name created_at status')
        .skip(Number(start))
        .limit(Number(limit))
        .sort(sort)
        .exec();
      results = results.map((result: any) => {
        return {
          ...result.toObject(),
          actions: [
            {
              id: 1,
              label: 'Edit',
              type: 'link',
              endpoint: '/admin/locations/' + result._id,
            },
            {
              id: 2,
              label: 'Delete',
              type: 'delete',
              endpoint: `${this.configService.get('app.api_url')}/locations/${
                result._id
              }`,
              confirm_message: 'Are you sure want to delete?',
            },
          ],
        };
      });

      return {
        recordsFiltered: recordsFiltered,
        recordsTotal: recordsTotal,
        data: results,
      };
    } catch (error) {
      return error;
    }
  }
}
