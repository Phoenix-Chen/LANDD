import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { DeviceController } from './device.controller';
import { deviceProviders } from './device.provider';
import { DeviceService } from './device.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DeviceController],
  providers: [...deviceProviders, DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
