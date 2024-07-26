import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async findAll() {
    return this.coursesRepository.find();
  }

  async findOne(id: number) {
    const course = await this.coursesRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course ID: ${id} not found`);
    }

    return course;
  }

  async create(createCourseDto: any) {
    const course = this.coursesRepository.create(createCourseDto);

    return this.coursesRepository.save(course);
  }

  async update(id: number, updateCourseDto: any) {
    const course = await this.coursesRepository.preload({
      id,
      ...updateCourseDto,
    });

    if (!course) {
      throw new NotFoundException(`Course ID: ${id} not found`);
    }

    return this.coursesRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.coursesRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course ID: ${id} not found`);
    }

    this.coursesRepository.remove(course);
  }
}
