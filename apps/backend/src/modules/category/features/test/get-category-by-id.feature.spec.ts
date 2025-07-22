import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { GetCategoryByIdFeature } from '../get-category-by-id.feature';
import { CategoryService } from '../../services/category.service';
import { CategoryStatus } from '../../enums/category-status.enum';

describe('GetCategoryByIdFeature', () => {
  let feature: GetCategoryByIdFeature;
  let categoryService: CategoryService;

  const mockCategoryData = {
    _id: '66082529899034a393c5a963',
    name: 'Technology',
    status: CategoryStatus.ACTIVE,
    created_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCategoryByIdFeature,
        {
          provide: CategoryService,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    feature = module.get<GetCategoryByIdFeature>(GetCategoryByIdFeature);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(feature).toBeDefined();
  });

  describe('handle', () => {
    it('should get category by id successfully', async () => {
      jest
        .spyOn(categoryService, 'getById')
        .mockResolvedValue(mockCategoryData as any);

      const result = await feature.handle(mockCategoryData._id);

      expect(categoryService.getById).toHaveBeenCalledWith(
        mockCategoryData._id,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBeNull();
      expect(result.response.data).toEqual(mockCategoryData);
    });

    it('should handle non-existent category', async () => {
      jest.spyOn(categoryService, 'getById').mockResolvedValue(null);

      const result = await feature.handle('non-existent-id');

      expect(categoryService.getById).toHaveBeenCalledWith('non-existent-id');
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBeNull();
      expect(result.response.data).toBeNull();
    });

    it('should handle invalid id format', async () => {
      jest
        .spyOn(categoryService, 'getById')
        .mockRejectedValue(new Error('Invalid ObjectId'));

      const result = await feature.handle('invalid-id');

      expect(categoryService.getById).toHaveBeenCalledWith('invalid-id');
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle database errors', async () => {
      jest
        .spyOn(categoryService, 'getById')
        .mockRejectedValue(new Error('Database connection failed'));

      const result = await feature.handle(mockCategoryData._id);

      expect(categoryService.getById).toHaveBeenCalledWith(
        mockCategoryData._id,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle null/undefined id', async () => {
      jest
        .spyOn(categoryService, 'getById')
        .mockRejectedValue(new Error('Invalid input'));

      const result = await feature.handle(null as any);

      expect(categoryService.getById).toHaveBeenCalledWith(null);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle empty string id', async () => {
      jest
        .spyOn(categoryService, 'getById')
        .mockRejectedValue(new Error('Invalid input'));

      const result = await feature.handle('');

      expect(categoryService.getById).toHaveBeenCalledWith('');
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle network timeout errors', async () => {
      jest
        .spyOn(categoryService, 'getById')
        .mockRejectedValue(new Error('Network timeout'));

      const result = await feature.handle(mockCategoryData._id);

      expect(categoryService.getById).toHaveBeenCalledWith(
        mockCategoryData._id,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should call service getById method exactly once', async () => {
      jest
        .spyOn(categoryService, 'getById')
        .mockResolvedValue(mockCategoryData as any);

      await feature.handle(mockCategoryData._id);

      expect(categoryService.getById).toHaveBeenCalledTimes(1);
    });
  });
});
