import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { Category } from '../schemas/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { ModelService } from '../../app/services';

@Injectable()
export class CategoryService extends ModelService<Category> {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    private configService: ConfigService,
  ) {
    super();
  }

  public async getAll() {
    return await this.categoryModel.find({ status: 'Active' });
  }

  public async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryModel.create(createCategoryDto);
  }

  public async getById(id: string) {
    return await this.categoryModel.findById(id);
  }

  public async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryModel.findByIdAndUpdate(
      { _id: id },
      updateCategoryDto,
    );
  }

  public async delete(id: string) {
    return await this.categoryModel.deleteOne({
      _id: id,
    });
  }

  public async datatable(
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
      /*
      else if (daterange) {
        const date_array = daterange.split('-');
        const start_date = moment(new Date(date_array[0])).format('YYYY-MM-DD');
        const end_date = moment(new Date(date_array[1])).format('YYYY-MM-DD');
        const formatted_start_date = moment.utc(start_date).format();
        const formatted_end_date = moment.utc(end_date).format();
        searchQuery = {
          created_at: { $gt: formatted_start_date, $lt: formatted_end_date },
        };
      }
      */

      searchQuery = { ...searchQuery, ...whereQuery };

      if (order.length && columns.length) {
        const sortByOrder: any = order.reduce((memo: any, ordr: any) => {
          columns[ordr.column];
          memo[ordr.name] = ordr.dir === 'asc' ? 1 : -1;
          return memo;
        }, {});

        if (Object.keys(sortByOrder).length) {
          sort = sortByOrder;
        }
      }

      let recordsTotal = 0;
      let recordsFiltered = 0;

      const all_count = await this.categoryModel.countDocuments({});
      recordsTotal = all_count;

      const filtered_count = await this.categoryModel.countDocuments(
        searchQuery,
      );
      recordsFiltered = filtered_count;

      let results = await this.categoryModel
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
              endpoint: '/admin/categories/' + result._id,
            },
            {
              id: 2,
              label: 'Delete',
              type: 'delete',
              endpoint: `${this.configService.get('app.api_url')}/categories/${
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
