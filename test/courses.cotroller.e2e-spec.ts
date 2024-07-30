import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { CoursesModule } from '../src/courses/courses.module';
import { Course } from '../src/courses/entities/courses.entity';
import { Tag } from '../src/courses/entities/tags.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

describe('CoursesController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let data: any;
  let courses: Course[];

  const dataSourceOptionTest: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_TEST_HOST,
    port: +process.env.DB_TEST_PORT,
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_NAME,
    entities: [Course, Tag],
    synchronize: true,
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => dataSourceOptionTest,
        }),
        CoursesModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    data = {
      title: 'Any Course',
      description: 'Any Description',
      tags: [{ name: 'Any Tag' }],
    };
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceOptionTest).initialize();
    const repository = dataSource.getRepository(Course);
    courses = await repository.find();
    await dataSource.destroy();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /courses', () => {
    it('should create a course', async () => {
      const response = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe(data.title);
      expect(response.body.description).toBe(data.description);
      expect(response.body.created_at).toBeDefined();
      expect(response.body.tags).toMatchObject(data.tags);
    });
  });
});
