import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LocationService } from './services/location.service';
import { LocationController } from './controllers/location.controller';
import { LocationSchema, Location } from './schemas/location.schema';
import { CreateLocationFeature } from './features/create-location-feature';
import { DeleteLocationFeature } from './features/delete-location-feature';
import { GetAllLocationsFeature } from './features/get-all-locations-features';
import { GetLocationByIdFeature } from './features/get-location-by-id-feature';
import { UpdateLocationFeature } from './features/update-location-feature';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    UserModule
  ],
  providers: [
    LocationService,
    CreateLocationFeature,
    DeleteLocationFeature,
    GetAllLocationsFeature,
    GetLocationByIdFeature,
    UpdateLocationFeature,
  ],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
