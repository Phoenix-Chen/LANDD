import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DeviceModule } from './device/device.module';
import { TasksService } from './tasks/tasks.service';
import { DeviceConnectListener } from './listeners/device-event.listener';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DeviceModule,
  ],
  controllers: [],
  providers: [TasksService, DeviceConnectListener],
})
export class AppModule {}
