import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Course } from './entities/courses.entity';

@Injectable()
export class CoursesService {
  private readonly courses: Course[] = [
    {
      id: 1,
      title: 'NestJS Basics',
      description: 'Learn the basics of NestJS',
      tags: ['nestjs', 'nodejs', 'javascript'],
    },
    {
      id: 2,
      title: 'NestJS Intermediate',
      description: 'Learn the intermediate concepts of NestJS',
      tags: ['nestjs', 'nodejs', 'javascript'],
    },
    {
      id: 3,
      title: 'NestJS Advanced',
      description: 'Learn the advanced concepts of NestJS',
      tags: ['nestjs', 'nodejs', 'javascript'],
    },
  ];

  findAll() {
    return this.courses;
  }

  findOne(id: number) {
    const course = this.courses.find((course) => course.id === id);
    if (!course) {
      throw new HttpException(
        `Course ID: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  create(createCourseDto: any) {
    this.courses.push(createCourseDto);
    return createCourseDto;
  }

  update(id: number, updateCourseDto: any) {
    const existingCourse = this.findOne(id);
    if (existingCourse) {
      const courseIndex = this.courses.findIndex((course) => course.id === id);
      this.courses[courseIndex] = {
        ...existingCourse,
        ...updateCourseDto,
      };
    }
  }

  remove(id: number) {
    const courseIndex = this.courses.findIndex((course) => course.id === id);
    if (courseIndex >= 0) {
      this.courses.splice(courseIndex, 1);
    }
    return this.courses;
  }
}
