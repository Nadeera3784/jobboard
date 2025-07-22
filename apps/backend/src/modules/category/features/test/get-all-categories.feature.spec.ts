import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { GetAllCategoriesFeature } from '../get-all-categories.feature';
import { CategoryService } from '../../services/category.service';
import { CategoryStatus } from '../../enums/category-status.enum';

describe('GetAllCategoriesFeature', () => {
  let feature: GetAllCategoriesFeature;
  let categoryService: CategoryService;

  const mockCategoriesData = [
    {
      _id: '66082529899034a393c5a963',
      name: 'Technology',
      status: CategoryStatus.ACTIVE,
      created_at: new Date(),
    },
    {
      _id: '66082529899034a393c5a964',
      name: 'Science',
      status: CategoryStatus.ACTIVE,
      created_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllCategoriesFeature,
        {
          provide: CategoryService,
          useValue: {
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    feature = module.get<GetAllCategoriesFeature>(GetAllCategoriesFeature);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(feature).toBeDefined();
  });

  describe('handle', () => {
    it('should get all categories successfully', async () => {
      jest
        .spyOn(categoryService, 'getAll')
        .mockResolvedValue(mockCategoriesData as any);

      const result = await feature.handle();

      expect(categoryService.getAll).toHaveBeenCalled();
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBeNull();
      expect(result.response.data).toEqual(mockCategoriesData);
    });

    it('should handle empty categories list', async () => {
      jest.spyOn(categoryService, 'getAll').mockResolvedValue([]);

      const result = await feature.handle();

      expect(categoryService.getAll).toHaveBeenCalled();
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBeNull();
      expect(result.response.data).toEqual([]);
    });

    it('should handle database errors', async () => {
      jest
        .spyOn(categoryService, 'getAll')
        .mockRejectedValue(new Error('Database connection failed'));

      const result = await feature.handle();

      expect(categoryService.getAll).toHaveBeenCalled();
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle network timeout errors', async () => {
      jest
        .spyOn(categoryService, 'getAll')
        .mockRejectedValue(new Error('Network timeout'));

      const result = await feature.handle();

      expect(categoryService.getAll).toHaveBeenCalled();
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle service unavailable errors', async () => {
      jest
        .spyOn(categoryService, 'getAll')
        .mockRejectedValue(new Error('Service unavailable'));

      const result = await feature.handle();

      expect(categoryService.getAll).toHaveBeenCalled();
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should call service getAll method exactly once', async () => {
      jest
        .spyOn(categoryService, 'getAll')
        .mockResolvedValue(mockCategoriesData as any);

      await feature.handle();

      expect(categoryService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return single category in array', async () => {
      const singleCategory = [mockCategoriesData[0]];
      jest
        .spyOn(categoryService, 'getAll')
        .mockResolvedValue(singleCategory as any);

      const result = await feature.handle();

      expect(categoryService.getAll).toHaveBeenCalled();
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.data).toEqual(singleCategory);
      expect(result.response.data).toHaveLength(1);
    });
  });
});
