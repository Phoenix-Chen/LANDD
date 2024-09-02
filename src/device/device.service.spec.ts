import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from "./device.service";
import { DeviceModule } from './device.module';
import { randomMacAddress, randomIP, sortDeviceArray } from '../../src/utils';
import { DataSource } from 'typeorm';
import { Device } from './device.entity';
import { UpdateOrCreateDto } from './dto/patch-device.dto';
import { DEVICE_REPOSITORY } from '../../src/constants';

describe('DeviceService', () => {
  let deviceService: DeviceService;
  let deviceDataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DeviceModule],
    }).compile();

    deviceService = moduleFixture.get<DeviceService>(DeviceService);
    deviceDataSource = moduleFixture.get<DataSource>(DEVICE_REPOSITORY);
  });

  describe('Test updateOrCreate', () => {
    it('Non-exist mac address - Create', async () => {
      const newDevice: UpdateOrCreateDto = {
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: true,
        name: 'iPhone 10',
      } 
      await deviceService.bulkUpdateOrCreate([newDevice]);
      return expect(
        await deviceDataSource.manager.getRepository(Device).findOneByOrFail({ macAddress: newDevice.macAddress })
      ).toEqual(newDevice);
    });

    it('Exist mac address - update', async () => {
        const newDevice = await deviceDataSource.manager.getRepository(Device).save({
            macAddress: randomMacAddress(),
            ip: randomIP(),
            online: true,
        });
        const expectDevice = {
            ...newDevice,
            ip: randomIP(),
            online: false,
        };
        await deviceService.bulkUpdateOrCreate([expectDevice]);
        return expect(
            await deviceDataSource.manager.getRepository(Device).findOneByOrFail({ macAddress: newDevice.macAddress })
        ).toEqual(expectDevice);
    });

    it('Update or create', async () => {
      const newDevice1 = await deviceDataSource.manager.getRepository(Device).save({
          macAddress: randomMacAddress(),
          ip: randomIP(),
          online: true,
      });
      const newDevice2 = await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: true,
      });
      const expectDevices = [
        {
          ...newDevice2,
          ip: randomIP(),
          online: false,
        },
        {
          macAddress: randomMacAddress(),
          ip: randomIP(),
          online: true,
          name: 'iPhone 13',
        }
      ];
      expect(
        sortDeviceArray(await deviceService.bulkUpdateOrCreate(expectDevices))
      ).toEqual(sortDeviceArray(expectDevices));
      return expect(
        sortDeviceArray(await deviceDataSource.manager.getRepository(Device).find())
      ).toEqual(sortDeviceArray([newDevice1, ...expectDevices]));
    });
  });
});
