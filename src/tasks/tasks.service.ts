import { Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { execSync } from 'child_process';
import { parseDevices } from '../utils';
import { DeviceService } from '../device/device.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_DEVICE_CONNECT, EVENT_DEVICE_DISCONNET } from 'src/constants';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Inject(DeviceService)
  private readonly deviceService: DeviceService;

  constructor(private eventEmitter: EventEmitter2) {}

  // Calling every 10 secs
  @Interval(10000)
  async updateDevices() {
    try {
      const curOnlineDevices = await this.deviceService.findAll({ online: true });
      const curOnlineMacAddresses = curOnlineDevices.map((device) => device.macAddress);
      
      // FIXME: Find other ways to force arp table to update
      execSync('nmap -sP 192.168.1.0/24');

      const stdout = execSync('arp -a');
      const stdoutOnlineDevices = await this.deviceService.bulkUpdateOrCreate(parseDevices(stdout.toString()));
      const stdoutOnlineMacAddresses = stdoutOnlineDevices.map((device) => device.macAddress);
      console.log(`stdout:`);
      console.log(stdoutOnlineDevices);

      const newOfflineDevices = curOnlineDevices.filter(device => !stdoutOnlineMacAddresses.includes(device.macAddress));
      (await this.deviceService.bulkUpdateOrCreate(
        newOfflineDevices.map((device) => {
          return {
            ...device,
            online: false,
          }
        })
      )).forEach(device => this.eventEmitter.emitAsync(EVENT_DEVICE_DISCONNET, device));
      
      const newOnlineDevices = stdoutOnlineDevices.filter(device => !curOnlineMacAddresses.includes(device.macAddress));
      newOnlineDevices.forEach(device => this.eventEmitter.emitAsync(EVENT_DEVICE_CONNECT, device));
    } catch (e) {
      this.logger.log(e);
    }
  }
}
