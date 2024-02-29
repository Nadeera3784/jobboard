import { Module } from '@nestjs/common';
import { LocationService } from './services/location.service';
import { LocationController } from './controllers/location.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema, Location } from './schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  providers: [LocationService],
  controllers: [LocationController],
})

export class LocationModule {}
