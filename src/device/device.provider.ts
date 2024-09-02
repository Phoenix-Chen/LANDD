import { DataSource } from 'typeorm';
import { Device } from './device.entity';
import { DATA_SOURCE, DEVICE_REPOSITORY } from '../../src/constants';

export const deviceProviders = [
  {
    provide: DEVICE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Device),
    inject: [DATA_SOURCE],
  },
];
