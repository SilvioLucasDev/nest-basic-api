import { randomUUID } from 'node:crypto';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

describe('CoursesService unit test', () => {
  let service: CoursesService;
  let id: string;
  let created_at: Date;
  let expectOutputTags: any;
  let expectOutputCourses: any;
  let mockCoursesRepository: any;
  let mockTagsRepository: any;

  beforeEach(async () => {
    service = new CoursesService();
    id = randomUUID();
    created_at = new Date();

    expectOutputTags = [
      {
        id,
        name: 'tag',
        created_at,
      },
    ];

    expectOutputCourses = {
      id,
      title: 'course',
      description: 'description',
      created_at,
      tags: expectOutputTags,
    };

    mockCoursesRepository = {
      create: jest.fn().mockResolvedValue(expectOutputCourses),
      save: jest.fn().mockResolvedValue(expectOutputCourses),
      find: jest.fn().mockResolvedValue(expectOutputCourses),
      findOne: jest.fn().mockResolvedValue(expectOutputCourses),
      preload: jest.fn().mockResolvedValue(expectOutputCourses),
      remove: jest.fn().mockResolvedValue(expectOutputCourses),
    };

    mockTagsRepository = {
      findOne: jest.fn().mockResolvedValue(expectOutputTags),
      create: jest.fn().mockResolvedValue(expectOutputTags),
    };

    //@ts-expect-error define private method
    service['coursesRepository'] = mockCoursesRepository;
    //@ts-expect-error define private method
    service['tagsRepository'] = mockTagsRepository;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a course', async () => {
    const createCourseDto: CreateCourseDto = {
      title: 'course',
      description: 'description',
      tags: ['tag'],
    };

    const newCourse = await service.create(createCourseDto);

    expect(mockCoursesRepository.create).toHaveBeenCalled();
    expect(mockCoursesRepository.save).toHaveBeenCalled();
    expect(mockTagsRepository.findOne).toHaveBeenCalled();
    expect(newCourse).toEqual(expectOutputCourses);
  });

  it('should list all courses', async () => {
    const courses = await service.findAll();

    expect(mockCoursesRepository.find).toHaveBeenCalled();
    expect(courses).toEqual(expectOutputCourses);
  });

  it('should get a course by id', async () => {
    const course = await service.findOne(id);

    expect(mockCoursesRepository.findOne).toHaveBeenCalled();
    expect(course).toEqual(expectOutputCourses);
  });

  it('should update a course', async () => {
    const updateCourseDto: UpdateCourseDto = {
      title: 'course',
      description: 'description',
      tags: ['tag'],
    };

    const updatedCourse = await service.update(id, updateCourseDto);

    expect(mockCoursesRepository.save).toHaveBeenCalled();
    expect(mockCoursesRepository.preload).toHaveBeenCalled();
    expect(mockTagsRepository.findOne).toHaveBeenCalled();
    expect(updatedCourse).toEqual(expectOutputCourses);
  });

  it('should remove a course', async () => {
    await service.remove(id);

    expect(mockCoursesRepository.findOne).toHaveBeenCalled();
    expect(mockCoursesRepository.remove).toHaveBeenCalled();
  });
});
