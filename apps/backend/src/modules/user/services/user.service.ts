import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';

import { CreateUserDto, UpdateUserDto } from '../dtos';
import { User } from '../schemas/user.schema';
import { RolesEnum } from '../enums';
import { ModelService } from '../../app/services';
import { ObjectId } from 'mongoose';

@Injectable()
export class UserService extends ModelService<User> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private configService: ConfigService,
  ) {
    super();
  }


  public async getAll() {
    return await this.userModel.find();
  }


  public async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  public async getById(id: string) {
    return await this.userModel.findById(id);
  }

 
  public async getByEmail(email: string) {
    return await this.userModel.findOne({
      email: email,
    });
  }


  public async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate({ _id: id }, updateUserDto, {
      returnNewDocument: true,
    });
  }

  public async updateSettings(id: string, updateUserSettingsDto: any) {
    return await this.userModel.findByIdAndUpdate(
      { _id: id },
      updateUserSettingsDto,
      {
        returnNewDocument: true,
      },
    );
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

  public async updatePassword(id: ObjectId, password: string) {
    return await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        password: password,
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
        const baseActions = [
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
        ];

        // Add View action for company users
        if (result.role === 'company') {
          baseActions.unshift({
            id: 0,
            label: 'View',
            type: 'view',
            endpoint: `/admin/companies/${result._id}`,
          });
        }

        return {
          ...result.toObject(),
          actions: baseActions,
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
