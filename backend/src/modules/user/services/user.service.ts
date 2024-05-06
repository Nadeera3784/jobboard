import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';

import { CreateUserDto, UpdateUserDto } from '../dtos';
import { User } from '../schemas/user.schema';
import { RolesEnum } from '../enums';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private configService: ConfigService,
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
   * TODO:update with genSalt
   */
  public async create(createUserDto: CreateUserDto) {
    //const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return await this.userModel.create(createUserDto);
  }

  /**
   * Retrieves a user by their unique identifier.
   * @param id - The unique identifier of the user to retrieve.
   * @returns A promise that resolves to the user with the specified ID, or null if not found.
   */
  public async getById(id: string) {
    return await this.userModel.findById(id);
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
    return await this.userModel.findByIdAndUpdate({ _id: id }, updateUserDto, {
      returnNewDocument: true,
    });
  }

  public async updateEmailVerified(id: string) {
    return await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        email_verified: new Date(),
      },
    );
  }

  public async refreshUpdatedDate(id: string) {
    return await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        updated_at: new Date(),
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

  public async getInactivityUsers(
    duration = 6,
    batchSize = 20,
    roles: string[] = [RolesEnum.USER, RolesEnum.COMPANY],
  ) {
    return await this.userModel
      .aggregate([
        {
          $match: {
            role: { $in: roles },
          },
        },
        {
          $addFields: {
            hasNotUpdatedWithinSixMonths: {
              $cond: {
                if: { $eq: [{ $type: '$updated_at' }, 'date'] },
                then: {
                  $lt: [
                    '$updated_at',
                    moment().subtract(duration, 'months').toDate(),
                  ],
                },
                else: true,
              },
            },
          },
        },
        {
          $match: {
            hasNotUpdatedWithinSixMonths: true,
          },
        },
      ])
      .cursor({
        batchSize: batchSize,
      });
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

      if (filters.role) {
        whereQuery.role = filters.role;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        searchQuery = {
          $or: [{ name: regex }, { email: regex }],
        };
      }

      searchQuery = { ...searchQuery, ...whereQuery };

      if (order.length && columns.length) {
        const sortByOrder: any = order.reduce((memo: any, ordr: any) => {
          memo[ordr.name] = ordr.dir === 'asc' ? 1 : -1;
          return memo;
        }, {});

        if (Object.keys(sortByOrder).length) {
          sort = sortByOrder;
        }
      }

      recordsTotal = await this.userModel.countDocuments({});

      recordsFiltered = await this.userModel.countDocuments(searchQuery);

      let results = await this.userModel
        .find(searchQuery, 'name email')
        .select('_id name email phone role created_at status')
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
              endpoint: `/admin/users/${result._id}`,
            },
            {
              id: 2,
              label: 'Delete',
              type: 'delete',
              endpoint: `${this.configService.get('app.api_url')}/users/${
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
