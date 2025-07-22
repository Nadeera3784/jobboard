import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { DeleteCategoryFeature } from '../delete-category.feature';
import { CategoryService } from '../../services/category.service';

describe('DeleteCategoryFeature', () => {
  let feature: DeleteCategoryFeature;
  let categoryService: CategoryService;

  const mockCategoryId = '66082529899034a393c5a963';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCategoryFeature,
        {
          provide: CategoryService,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    feature = module.get<DeleteCategoryFeature>(DeleteCategoryFeature);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(feature).toBeDefined();
  });

  describe('handle', () => {
    it('should delete category successfully', async () => {
      const deleteResult = { acknowledged: true, deletedCount: 1 };
      jest
        .spyOn(categoryService, 'delete')
        .mockResolvedValue(deleteResult as any);

      const result = await feature.handle(mockCategoryId);

      expect(categoryService.delete).toHaveBeenCalledWith(mockCategoryId);
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBe(
        'Category has been deleted successfully',
      );
      expect(result.response.data).toBeNull();
    });

    it('should handle non-existent category', async () => {
      jest
        .spyOn(categoryService, 'delete')
        .mockRejectedValue(new Error('Category not found'));

      const result = await feature.handle('non-existent-id');

      expect(categoryService.delete).toHaveBeenCalledWith('non-existent-id');
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle invalid id format', async () => {
      jest
        .spyOn(categoryService, 'delete')
        .mockRejectedValue(new Error('Invalid ObjectId'));

      const result = await feature.handle('invalid-id');

      expect(categoryService.delete).toHaveBeenCalledWith('invalid-id');
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle database errors', async () => {
      jest
        .spyOn(categoryService, 'delete')
        .mockRejectedValue(new Error('Database connection failed'));

      const result = await feature.handle(mockCategoryId);

      expect(categoryService.delete).toHaveBeenCalledWith(mockCategoryId);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle constraint violations', async () => {
      jest
        .spyOn(categoryService, 'delete')
        .mockRejectedValue(
          new Error('Cannot delete category with existing dependencies'),
        );

      const result = await feature.handle(mockCategoryId);

      expect(categoryService.delete).toHaveBeenCalledWith(mockCategoryId);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle null/undefined id', async () => {
      jest
        .spyOn(categoryService, 'delete')
        .mockRejectedValue(new Error('Invalid input'));

      const result = await feature.handle(null as any);

      expect(categoryService.delete).toHaveBeenCalledWith(null);
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should call service delete method exactly once', async () => {
      const deleteResult = { acknowledged: true, deletedCount: 1 };
      jest
        .spyOn(categoryService, 'delete')
        .mockResolvedValue(deleteResult as any);

      await feature.handle(mockCategoryId);

      expect(categoryService.delete).toHaveBeenCalledTimes(1);
    });
  });
});
