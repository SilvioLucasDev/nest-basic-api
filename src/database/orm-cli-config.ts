import { DataSource, DataSourceOptions } from 'typeorm';
import { Course } from 'src/courses/entities/courses.entity';
import { Tag } from 'src/courses/entities/tags.entity';

export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Course, Tag],
  synchronize: false,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
};

export const ormCliConfig: DataSource = new DataSource(dataSourceOption);
