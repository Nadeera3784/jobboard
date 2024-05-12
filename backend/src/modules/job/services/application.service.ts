import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Application } from '../schemas/application.shema';
import { CreateApplicationDto, UpdateApplicationDto } from '../dtos';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<Application>,
  ) {}

  public async getAll() {
    return await this.applicationModel.find({});
  }

  public async getById(id: string) {
    return await this.applicationModel.findById(id);
  }

  public async create(createApplicationDto: CreateApplicationDto, id: string) {
    return await this.applicationModel.create({
      user: createApplicationDto.user,
      job: id,
    });
  }

  public async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    return await this.applicationModel.findByIdAndUpdate(
      { _id: id },
      updateApplicationDto,
    );
  }

  public async delete(id: string) {
    return await this.applicationModel.deleteOne({
      _id: id,
    });
  }
}
