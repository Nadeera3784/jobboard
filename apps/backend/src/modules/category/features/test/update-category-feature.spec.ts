import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { UpdateCategorynFeature } from '../update-category-feature';
import { CategoryService } from '../../services/category.service';
import { UpdateCategoryDto } from '../../dtos/update-category.dto';
import { CategoryStatus } from '../../enums/category-status.enum';

describe('UpdateCategorynFeature', () => {
  let feature: UpdateCategorynFeature;
  let categoryService: CategoryService;

  const mockCategoryData = {
    _id: '66082529899034a393c5a963',
    name: 'Updated Technology',
    status: CategoryStatus.ACTIVE,
    created_at: new Date(),
  };

  const mockUpdateCategoryDto: UpdateCategoryDto = {
    name: 'Updated Science',
    status: CategoryStatus.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCategorynFeature,
        {
          provide: CategoryService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    feature = module.get<UpdateCategorynFeature>(UpdateCategorynFeature);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(feature).toBeDefined();
  });

  describe('handle', () => {
    it('should update category successfully', async () => {
      jest
        .spyOn(categoryService, 'update')
        .mockResolvedValue(mockCategoryData as any);

      const result = await feature.handle(
        mockCategoryData._id,
        mockUpdateCategoryDto,
      );

      expect(categoryService.update).toHaveBeenCalledWith(
        mockCategoryData._id,
        mockUpdateCategoryDto,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBe(
        'Category has been updated successfully',
      );
      expect(result.response.data).toBeNull();
    });

    it('should handle non-existent category', async () => {
      jest
        .spyOn(categoryService, 'update')
        .mockRejectedValue(new Error('Category not found'));

      const result = await feature.handle(
        'non-existent-id',
        mockUpdateCategoryDto,
      );

      expect(categoryService.update).toHaveBeenCalledWith(
        'non-existent-id',
        mockUpdateCategoryDto,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle validation errors', async () => {
      const invalidDto = { name: '' } as UpdateCategoryDto;
      jest
        .spyOn(categoryService, 'update')
        .mockRejectedValue(new Error('Validation failed'));

      const result = await feature.handle(mockCategoryData._id, invalidDto);

      expect(categoryService.update).toHaveBeenCalledWith(
        mockCategoryData._id,
        invalidDto,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle partial updates', async () => {
      const partialDto = { name: 'Partial Update' } as UpdateCategoryDto;
      jest.spyOn(categoryService, 'update').mockResolvedValue({
        ...mockCategoryData,
        name: 'Partial Update',
      } as any);

      const result = await feature.handle(mockCategoryData._id, partialDto);

      expect(categoryService.update).toHaveBeenCalledWith(
        mockCategoryData._id,
        partialDto,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBe(
        'Category has been updated successfully',
      );
    });

    it('should handle status only updates', async () => {
      const statusDto = {
        status: CategoryStatus.INACTIVE,
      } as UpdateCategoryDto;
      jest.spyOn(categoryService, 'update').mockResolvedValue({
        ...mockCategoryData,
        status: CategoryStatus.INACTIVE,
      } as any);

      const result = await feature.handle(mockCategoryData._id, statusDto);

      expect(categoryService.update).toHaveBeenCalledWith(
        mockCategoryData._id,
        statusDto,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBe(
        'Category has been updated successfully',
      );
    });

    it('should handle invalid id format', async () => {
      jest
        .spyOn(categoryService, 'update')
        .mockRejectedValue(new Error('Invalid ObjectId'));

      const result = await feature.handle('invalid-id', mockUpdateCategoryDto);

      expect(categoryService.update).toHaveBeenCalledWith(
        'invalid-id',
        mockUpdateCategoryDto,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle database errors', async () => {
      jest
        .spyOn(categoryService, 'update')
        .mockRejectedValue(new Error('Database connection failed'));

      const result = await feature.handle(
        mockCategoryData._id,
        mockUpdateCategoryDto,
      );

      expect(categoryService.update).toHaveBeenCalledWith(
        mockCategoryData._id,
        mockUpdateCategoryDto,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should call service update method exactly once', async () => {
      jest
        .spyOn(categoryService, 'update')
        .mockResolvedValue(mockCategoryData as any);

      await feature.handle(mockCategoryData._id, mockUpdateCategoryDto);

      expect(categoryService.update).toHaveBeenCalledTimes(1);
    });
  });
});
