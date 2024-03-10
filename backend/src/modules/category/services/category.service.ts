import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import moment from 'moment';

import { Category } from '../schemas/category.schema';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) { }

  /**
   * Retrieves all categories.
   * @returns A promise that resolves to an array of all categories.
   */
  async getAll(query = {}, select = '') {
    return await this.categoryModel.find(query).select(select);
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



  async datatable(request: any) {
    try {
      const params = request.body;
      let order = params.order || [];
      let columns = params.columns || [];
      const status = params.status || "";
      let searchQuery: any = {};
      const daterange = params.daterange || "";
      let sort: any = {};
      const whereQuery: any = { status: String };

      if (status) {
        whereQuery.status = status;
      }

      if (params.search.value) {
          const regex = new RegExp(params.search.value, "i");
          searchQuery = {
            $or: [
              { 'name': regex },
            ],
          };
      } else if (daterange) {
          const date_array = daterange.split("-");
          const start_date = moment(new Date(date_array[0])).format('YYYY-MM-DD');
          const end_date = moment(new Date(date_array[1])).format('YYYY-MM-DD');
          const formatted_start_date = moment.utc(start_date).format();
          const formatted_end_date = moment.utc(end_date).format();
          searchQuery = {
            'created_at': { $gt: formatted_start_date, $lt: formatted_end_date }
          };
      }

      if (order.length && columns.length) {
        const sortByOrder: any = order.reduce((memo: any, ordr: any) => {
          const column = columns[ordr.column];
          memo[ordr.name] = ordr.dir === 'asc' ? 1 : -1;
          return memo;
        }, {});

        console.log('sort', order);

        if (Object.keys(sortByOrder).length) {
          sort = sortByOrder;
        }
      }



      let recordsTotal = 0;
      let recordsFiltered = 0;

      const all_count = await this.categoryModel.countDocuments({});
      recordsTotal = all_count;

      const filtered_count = await this.categoryModel.countDocuments(searchQuery);
      recordsFiltered = filtered_count;
      
      const results = await this.categoryModel.find(searchQuery, 'name')
        .select("_id name created_at status")
        //.where(whereQuery)
        .skip(Number(params.start))
        .limit(Number(params.length))
        .sort(sort)
        .exec();

      const data = {
        "draw": params.draw,
        "recordsFiltered": recordsFiltered,
        "recordsTotal": recordsTotal,
        "data": results
      };
      return data;
    } catch (error) {
      return error;
    }
  }

}
