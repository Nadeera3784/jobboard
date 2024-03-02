import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) { }

    public async getAll() {
        return await this.userModel.find();
    }

    public async create(createUserDto: CreateUserDto) {
        try {
            const existingUser  = await this.getByEmail(createUserDto.email);
            if(existingUser){
                throw new BadRequestException('Email already in use!');
                return;
            }
            createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
            return await this.userModel.create(createUserDto);
        } catch (error) {
            return error;
        }
    }

    public async getById(id: string) {
        return await this.userModel.findById(id);
    }

    public  async getByEmail(email: string) {
        return await this.userModel.findOne({
            email: email
        });
    }

    public async update(id: string, updateUserDto: UpdateUserDto) {
        return await this.userModel.findByIdAndUpdate(
            { _id: id },
            updateUserDto,
        );
    }

    public async delete(id: string) {
        return await this.userModel.deleteOne({
            _id: id
        });
    }
}