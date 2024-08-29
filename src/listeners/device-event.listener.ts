import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { deviceConnectEvent } from '../events/device.event';
import { EVENT_DEVICE_CONNECT, EVENT_DEVICE_DISCONNET } from 'src/constants';

@Injectable()
export class DeviceConnectListener {
  @OnEvent(EVENT_DEVICE_CONNECT)
  handleDeviceConnectEvent(event: deviceConnectEvent) {
    // Your decice connect handler here
  }

  @OnEvent(EVENT_DEVICE_DISCONNET)
  handleDeviceDisconnectEvent(event: deviceConnectEvent) {
    // Your decice disconnect handler here
  }
}