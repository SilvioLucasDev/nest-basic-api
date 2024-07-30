import { DataSource, DataSourceOptions } from 'typeorm';
import { Course } from '../courses/entities/courses.entity';
import { Tag } from '../courses/entities/tags.entity';

export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Course, Tag],
  synchronize: false,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
};

export const ormCliConfig: DataSource = new DataSource(dataSourceOption);
