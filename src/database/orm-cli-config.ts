import { DataSource } from 'typeorm';
import { dataSourceOption } from './database.module';

export const ormCliConfig: DataSource = new DataSource({
  ...dataSourceOption,
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
});
