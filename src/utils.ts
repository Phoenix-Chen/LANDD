import { Device } from './device/device.entity';
import { isIP, isMACAddress } from 'class-validator';

export const parseDevices = (nmapOutput: string): Device[] => {
  const lines = nmapOutput.split(/\r?\n|\r|\n/g);
  const devices: Device[] = [];
  for (const line of lines) {
    const deviceInfo = line.match(/^(.*?) \((.*?)\) at (.*?) \[(.*?)\] on (.*?)$/);
    if (deviceInfo !== null) {
      const name = deviceInfo[1];
      const ip = deviceInfo[2];
      const macAddress = deviceInfo[3]; 
      if (isMACAddress(macAddress) && isIP(ip)) {
        devices.push(
          Object.assign(
            {
              macAddress,
              ip,
              online: true,
            },
            name === '?' ? null : {name},
          )
        );
      }
    }
  }
  return devices;
};

export const randomMacAddress = () => {
  return "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
    return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
  });
}

export const randomIP = () => Array(4).fill(0).map(
  (_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0)
).join('.');
