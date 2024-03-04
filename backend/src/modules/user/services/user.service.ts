import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

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
}
