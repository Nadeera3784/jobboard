import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Retrieves all users.
   * @returns A promise that resolves to an array of all users.
   */
  public async getAll() {
    return await this.userModel.find();
  }

  /**
   * Creates a new user with the provided user data.
   * @param createUserDto - Data for creating a new user.
   * @returns A promise that resolves to the created user, or an error if the operation fails.
   */
  public async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.getByEmail(createUserDto.email);
      if (existingUser) {
        throw new BadRequestException('Email already in use!');
        return;
      }
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      return await this.userModel.create(createUserDto);
    } catch (error) {
      return error;
    }
  }

  /**
   * Retrieves a user by their unique identifier.
   * @param id - The unique identifier of the user to retrieve.
   * @returns A promise that resolves to the user with the specified ID, or null if not found.
   */
  public async getById(id: string, select = '') {
    return await this.userModel.findById(id).select(select);
  }

  /**
   * Retrieves a user by their email address.
   * @param email - The email address of the user to retrieve.
   * @returns A promise that resolves to the user with the specified email, or null if not found.
   */
  public async getByEmail(email: string) {
    return await this.userModel.findOne({
      email: email,
    });
  }

  /**
   * Updates an existing user with the provided data.
   * @param id - The unique identifier of the user to update.
   * @param updateUserDto - Data for updating the user.
   * @returns A promise that resolves to the updated user, or null if the user with the specified ID is not found.
   */
  public async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate({ _id: id }, updateUserDto);
  }

  public async updateEmailVerified(id: string) {
    return await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        email_verified: new Date(),
      },
    );
  }

  public async updatePassword(id: string, password: string) {
    const newPassword = await bcrypt.hash(password, 10);
    return await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        password: newPassword,
      },
    );
  }

  /**
   * Deletes a user with the specified ID.
   * @param id - The unique identifier of the user to delete.
   * @returns A promise that resolves to a deletion result indicating success or failure.
   */
  public async delete(id: string) {
    return await this.userModel.deleteOne({
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
      let sort: any = {'created_at': -1};
      const whereQuery: any = { status: String };
      if (status) {
        whereQuery.status = status;
      }

      if (params.search.value) {
          const regex = new RegExp(params.search.value, "i");
          searchQuery = {
            $or: [
              { 'name': regex },
              { 'email': regex },
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

        if (Object.keys(sortByOrder).length) {
          sort = sortByOrder;
        }
      }

      let recordsTotal = 0;
      let recordsFiltered = 0;

      const all_count = await this.userModel.countDocuments({});
      recordsTotal = all_count;

      const filtered_count = await this.userModel.countDocuments(searchQuery);
      recordsFiltered = filtered_count;
      
      let results = await this.userModel.find(searchQuery, 'name email')
        .select("_id name email phone role created_at status")
        .skip(Number(params.start))
        .limit(Number(params.length))
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
                endpoint: '/admin/users/' + result._id
              },
              {
                id: 2,
                label: 'Delete',
                type: 'delete',
                endpoint: 'http://127.0.0.1:3000/api/v1/users/' + result._id,
                confirm_message: "Are you sure want to delete?"
              }
            ]
          };
        });

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

  async seeds(){
    for (let index = 0; index < 20; index++) {
      await this.userModel.create({
         name: faker.person.fullName(),
         email: faker.internet.email(),
         phone: faker.phone.number(),
         password: "$2b$10$a0g4BDaC/WPUWqGpg4PpveJY52wcdq9AyilBVfnkXijfCddczqDBK",
         email_verified: now(), 
         status: "Active"
      });
    }
  }
  
}
