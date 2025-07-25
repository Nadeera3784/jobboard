import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserSchema, User } from './schemas';
import { DeleteUserFeature } from './features/delete-user.feature';
import { GetAllUsersFeature } from './features/get-all-users.features';
import { GetUserByIdFeature } from './features/get-user-by-id.feature';
import { CreateUserFeature } from './features/create-user.feature';
import { UpdateUserFeature } from './features/update-user.feature';
import { UpdateUserSettingsFeature } from './features/update-user-settings.feature';
import { DatatableFeature } from './features/datatable.feature';
import { UserDeletedListener } from './listeners/user-deleted.listener';
import { UserSeedCommand, AdminSeedCommand } from './commands';
import { AppModule } from '../app/app.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AppModule),
  ],
  providers: [
    UserService,
    DeleteUserFeature,
    GetAllUsersFeature,
    GetUserByIdFeature,
    CreateUserFeature,
    UpdateUserFeature,
    UpdateUserSettingsFeature,
    DatatableFeature,
    JwtService,
    UserDeletedListener,
    UserSeedCommand,
    AdminSeedCommand,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
