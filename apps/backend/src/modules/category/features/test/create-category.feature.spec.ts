import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { CreateCategoryFeature } from '../create-category.feature';
import { CategoryService } from '../../services/category.service';
import { CreateCategoryDto } from '../../dtos/create-category.dto';
import { CategoryStatus } from '../../enums/category-status.enum';

describe('CreateCategoryFeature', () => {
  let feature: CreateCategoryFeature;
  let categoryService: CategoryService;

  const mockCategoryData = {
    _id: '66082529899034a393c5a963',
    name: 'Technology',
    status: CategoryStatus.ACTIVE,
    created_at: new Date(),
  };

  const mockCreateCategoryDto: CreateCategoryDto = {
    name: 'Science',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCategoryFeature,
        {
          provide: CategoryService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    feature = module.get<CreateCategoryFeature>(CreateCategoryFeature);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(feature).toBeDefined();
  });

  describe('handle', () => {
    it('should create category successfully', async () => {
      jest
        .spyOn(categoryService, 'create')
        .mockResolvedValue(mockCategoryData as any);

      const result = await feature.handle(mockCreateCategoryDto);

      expect(categoryService.create).toHaveBeenCalledWith(
        mockCreateCategoryDto,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBe(
        'Category has been created successfully',
      );
      expect(result.response.data).toBeNull();
    });

    it('should handle validation errors', async () => {
      const invalidDto = { name: '' } as CreateCategoryDto;
      jest
        .spyOn(categoryService, 'create')
        .mockRejectedValue(new Error('Validation failed'));

      const result = await feature.handle(invalidDto);

      expect(categoryService.create).toHaveBeenCalledWith(invalidDto);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle duplicate name errors', async () => {
      jest
        .spyOn(categoryService, 'create')
        .mockRejectedValue(new Error('Category name already exists'));

      const result = await feature.handle(mockCreateCategoryDto);

      expect(categoryService.create).toHaveBeenCalledWith(
        mockCreateCategoryDto,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle service exceptions', async () => {
      jest
        .spyOn(categoryService, 'create')
        .mockRejectedValue(new Error('Database connection failed'));

      const result = await feature.handle(mockCreateCategoryDto);

      expect(categoryService.create).toHaveBeenCalledWith(
        mockCreateCategoryDto,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle null/undefined dto', async () => {
      jest
        .spyOn(categoryService, 'create')
        .mockRejectedValue(new Error('Invalid input'));

      const result = await feature.handle(null as any);

      expect(categoryService.create).toHaveBeenCalledWith(null);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle empty name validation', async () => {
      const emptyNameDto = { name: '   ' } as CreateCategoryDto;
      jest
        .spyOn(categoryService, 'create')
        .mockRejectedValue(new Error('Name is required'));

      const result = await feature.handle(emptyNameDto);

      expect(categoryService.create).toHaveBeenCalledWith(emptyNameDto);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle name length validation errors', async () => {
      const longNameDto = {
        name: 'This is a very long category name that exceeds the maximum allowed length',
      } as CreateCategoryDto;
      jest
        .spyOn(categoryService, 'create')
        .mockRejectedValue(new Error('Name too long'));

      const result = await feature.handle(longNameDto);

      expect(categoryService.create).toHaveBeenCalledWith(longNameDto);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle special characters in name', async () => {
      const specialCharDto = { name: 'Tech@#$%' } as CreateCategoryDto;
      jest.spyOn(categoryService, 'create').mockResolvedValue({
        ...mockCategoryData,
        name: 'Tech@#$%',
      } as any);

      const result = await feature.handle(specialCharDto);

      expect(categoryService.create).toHaveBeenCalledWith(specialCharDto);
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBe(
        'Category has been created successfully',
      );
    });

    it('should handle network timeout errors', async () => {
      jest
        .spyOn(categoryService, 'create')
        .mockRejectedValue(new Error('Network timeout'));

      const result = await feature.handle(mockCreateCategoryDto);

      expect(categoryService.create).toHaveBeenCalledWith(
        mockCreateCategoryDto,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should call service create method exactly once', async () => {
      jest
        .spyOn(categoryService, 'create')
        .mockResolvedValue(mockCategoryData as any);

      await feature.handle(mockCreateCategoryDto);

      expect(categoryService.create).toHaveBeenCalledTimes(1);
    });
  });
});
