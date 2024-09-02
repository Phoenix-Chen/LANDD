import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { Device } from '../src/device/device.entity';
import { DeviceModule } from '../src/device/device.module';
import { randomMacAddress, randomIP, sortDeviceArray } from '../src/utils';

describe('DeviceController (e2e)', () => {
  let app: INestApplication;
  let deviceDataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DeviceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();

    deviceDataSource = moduleFixture.get<DataSource>("DEVICE_REPOSITORY");
  });

  describe('Test getAll', () => {
    it('No entity empty result', () => {
      return request(app.getHttpServer())
        .get('/device')
        .expect(200)
        .expect([]);
    });

    it('Get devices', async () => {
      const onlineDevice = await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: true,
      });
      const offlineDevice = await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: false,
      });
      return request(app.getHttpServer())
        .get('/device')
        .expect(200)
        .expect([onlineDevice, offlineDevice]);
    });

    it('Get devices filter online', async () => {
      const onlineDevice = await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: true,
      });
      await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: false,
      });
      return request(app.getHttpServer())
        .get('/device?online=true')
        .expect(200)
        .expect([onlineDevice]);
    });

    it('Get devices filter offline', async () => {
      await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: true,
      });
      const offlineDevice = await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: false,
      });
      return request(app.getHttpServer())
        .get('/device?online=false')
        .expect(200)
        .expect([offlineDevice]);
    });

    it('Get devices filter by mac address', async () => {
      const device1 = await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: true,
      });
      const device2 = await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: false,
      });
      await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: false,
      });
      const response = await request(app.getHttpServer())
        .get(`/device?macAddress_in=${device1.macAddress},${device2.macAddress}`);
      expect(response.status).toEqual(200);
      return expect(sortDeviceArray(response.body))
        .toEqual(sortDeviceArray([device2, device1]));
    });
  });

  describe('Test patchOne', () => {
    it('Update MAC address - Fail', async () => {
      const newDevice = await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: true,
      });
      return request(app.getHttpServer())
        .patch(`/device/${newDevice.macAddress}`)
        .send({
          macAddress: randomMacAddress(),
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(400)
        .expect({
          message: [ 'property macAddress should not exist', 'name must be a string' ],
          error: 'Bad Request',
          statusCode: 400
        });
    });

    it('Update ip address - Fail', async () => {
      const newDevice = await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: true,
      });
      return request(app.getHttpServer())
        .patch(`/device/${newDevice.macAddress}`)
        .send({
          ip: randomIP(),
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(400)
        .expect({
          message: [ 'property ip should not exist', 'name must be a string' ],
          error: 'Bad Request',
          statusCode: 400
        });
    });

    it('Update invalid MAC address - Fail', () => {
      return request(app.getHttpServer())
        .patch('/device/1')
        .send({
          name: 'iPhone 13',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(400)
        .expect({
          message: 'Invalid MAC address',
          error: 'Bad Request',
          statusCode: 400
        });
    });

    it('Update non-exist MAC address - Fail', () => {
      const macAddress = randomMacAddress();
      return request(app.getHttpServer())
        .patch(`/device/${macAddress}`)
        .send({
          name: 'iPhone 13',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(404)
        .expect({
          message: `could not find device with mac address ${macAddress}`,
          error: 'Not Found',
          statusCode: 404
        });
    });

    it('Update fields - Success', async () => {
      const newDevice = await deviceDataSource.manager.getRepository(Device).save({
        macAddress: randomMacAddress(),
        ip: randomIP(),
        online: true,
      });
      return request(app.getHttpServer())
        .patch(`/device/${newDevice.macAddress}`)
        .send({
            name: 'iPhone 13',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .expect({
          macAddress: newDevice.macAddress,
          name: 'iPhone 13',
          ip: newDevice.ip,
          online: true
        });
    });
  });
});
