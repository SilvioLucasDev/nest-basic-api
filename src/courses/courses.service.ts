import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tags.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async findAll() {
    return this.coursesRepository.find({
      relations: ['tags'],
    });
  }

  async findOne(id: string) {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!course) {
      throw new NotFoundException(`Course ID: ${id} not found`);
    }

    return course;
  }

  async create(createCourseDto: CreateCourseDto) {
    const tags = await Promise.all(
      createCourseDto.tags.map((tagName) => this.preloadTagByName(tagName)),
    );

    const course = this.coursesRepository.create({
      ...createCourseDto,
      tags,
    });

    return this.coursesRepository.save(course);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const tags =
      updateCourseDto.tags &&
      (await Promise.all(
        updateCourseDto.tags.map((tagName) => this.preloadTagByName(tagName)),
      ));

    const course = await this.coursesRepository.preload({
      id,
      ...updateCourseDto,
      tags,
    });

    if (!course) {
      throw new NotFoundException(`Course ID: ${id} not found`);
    }

    return this.coursesRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.coursesRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course ID: ${id} not found`);
    }

    this.coursesRepository.remove(course);
  }

  private async preloadTagByName(name: string): Promise<Tag> {
    const existingTag = await this.tagsRepository.findOne({ where: { name } });

    if (existingTag) {
      return existingTag;
    }

    return this.tagsRepository.create({ name });
  }
}
