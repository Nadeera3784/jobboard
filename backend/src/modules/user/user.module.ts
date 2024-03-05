import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserSchema, User } from './schemas/user.schema';
import { DeleteUserFeature } from './features/delete-user-feature';
import { GetAllUsersFeature } from './features/get-all-users-features';
import { GetUserByIdFeature } from './features/get-user-by-id-feature';
import { CreateUserFeature } from './features/create-user-feature';
import { UpdateUserFeature } from './features/update-user-feature';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UserService,
    DeleteUserFeature,
    GetAllUsersFeature,
    GetUserByIdFeature,
    CreateUserFeature,
    UpdateUserFeature,
    JwtService,
  ],
  controllers: [UserController],
  exports: [
    UserService,
    JwtService
  ],
})
export class UserModule {}
