import { DataSource } from 'typeorm';
import { dataSourceOption } from './database.module';

export const ormCliConfig: DataSource = new DataSource({
  ...dataSourceOption,
  synchronize: false,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
