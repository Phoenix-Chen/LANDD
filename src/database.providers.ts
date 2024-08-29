import { DataSource } from 'typeorm';
import { DATA_SOURCE, DB_NAME } from './constants';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: process.env.NODE_ENV === 'test' ? ':memory:' : DB_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'prod',
      });

      return dataSource.initialize();
    },
  },
];
