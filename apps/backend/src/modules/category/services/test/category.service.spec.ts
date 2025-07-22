import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

import { CategoryService } from '../category.service';
import { Category } from '../../schemas/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos';
import { CategoryStatus } from '../../enums/category-status.enum';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryModel: Model<Category>;
  let configService: ConfigService;

  const mockCategoryData = {
    _id: '66082529899034a393c5a963',
    name: 'Technology',
    status: CategoryStatus.ACTIVE,
    created_at: new Date(),
    toObject: jest.fn().mockReturnThis(),
  };

  const mockCreateCategoryDto: CreateCategoryDto = {
    name: 'Science',
  };

  const mockUpdateCategoryDto: UpdateCategoryDto = {
    name: 'Updated Technology',
    status: CategoryStatus.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            countDocuments: jest.fn(),
            skip: jest.fn(),
            limit: jest.fn(),
            sort: jest.fn(),
            exec: jest.fn(),
            select: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000/api'),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all active categories', async () => {
      const mockCategories = [mockCategoryData];
      jest
        .spyOn(categoryModel, 'find')
        .mockResolvedValue(mockCategories as any);

      const result = await service.getAll();

      expect(categoryModel.find).toHaveBeenCalledWith({ status: 'Active' });
      expect(result).toEqual(mockCategories);
    });

    it('should handle database errors', async () => {
      jest
        .spyOn(categoryModel, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.getAll()).rejects.toThrow('Database error');
    });

    it('should return empty array when no active categories exist', async () => {
      jest.spyOn(categoryModel, 'find').mockResolvedValue([]);

      const result = await service.getAll();

      expect(categoryModel.find).toHaveBeenCalledWith({ status: 'Active' });
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new category successfully', async () => {
      jest
        .spyOn(categoryModel, 'create')
        .mockResolvedValue(mockCategoryData as any);

      const result = await service.create(mockCreateCategoryDto);

      expect(categoryModel.create).toHaveBeenCalledWith(mockCreateCategoryDto);
      expect(result).toEqual(mockCategoryData);
    });

    it('should handle validation errors', async () => {
      const invalidDto = { name: '' } as CreateCategoryDto;
      jest
        .spyOn(categoryModel, 'create')
        .mockRejectedValue(new Error('Validation failed'));

      await expect(service.create(invalidDto)).rejects.toThrow(
        'Validation failed',
      );
    });

    it('should handle duplicate name errors', async () => {
      jest
        .spyOn(categoryModel, 'create')
        .mockRejectedValue(new Error('Duplicate key error'));

      await expect(service.create(mockCreateCategoryDto)).rejects.toThrow(
        'Duplicate key error',
      );
    });

    it('should create category with default status', async () => {
      const categoryWithoutStatus = { name: 'Test Category' };
      jest.spyOn(categoryModel, 'create').mockResolvedValue({
        ...categoryWithoutStatus,
        status: CategoryStatus.ACTIVE,
      } as any);

      const result = await service.create(
        categoryWithoutStatus as CreateCategoryDto,
      );

      expect(categoryModel.create).toHaveBeenCalledWith(categoryWithoutStatus);
      expect(result.status).toBe(CategoryStatus.ACTIVE);
    });
  });

  describe('getById', () => {
    it('should return category by id successfully', async () => {
      jest
        .spyOn(categoryModel, 'findById')
        .mockResolvedValue(mockCategoryData as any);

      const result = await service.getById(mockCategoryData._id);

      expect(categoryModel.findById).toHaveBeenCalledWith(mockCategoryData._id);
      expect(result).toEqual(mockCategoryData);
    });

    it('should return null for non-existent category', async () => {
      jest.spyOn(categoryModel, 'findById').mockResolvedValue(null);

      const result = await service.getById('non-existent-id');

      expect(categoryModel.findById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });

    it('should handle invalid id format', async () => {
      jest
        .spyOn(categoryModel, 'findById')
        .mockRejectedValue(new Error('Invalid ObjectId'));

      await expect(service.getById('invalid-id')).rejects.toThrow(
        'Invalid ObjectId',
      );
    });

    it('should handle database errors', async () => {
      jest
        .spyOn(categoryModel, 'findById')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.getById(mockCategoryData._id)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      const updatedCategory = { ...mockCategoryData, ...mockUpdateCategoryDto };
      jest
        .spyOn(categoryModel, 'findByIdAndUpdate')
        .mockResolvedValue(updatedCategory as any);

      const result = await service.update(
        mockCategoryData._id,
        mockUpdateCategoryDto,
      );

      expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: mockCategoryData._id },
        mockUpdateCategoryDto,
      );
      expect(result).toEqual(updatedCategory);
    });

    it('should return null for non-existent category', async () => {
      jest.spyOn(categoryModel, 'findByIdAndUpdate').mockResolvedValue(null);

      const result = await service.update(
        'non-existent-id',
        mockUpdateCategoryDto,
      );

      expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: 'non-existent-id' },
        mockUpdateCategoryDto,
      );
      expect(result).toBeNull();
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { name: 'Partial Update' };
      const updatedCategory = { ...mockCategoryData, name: 'Partial Update' };
      jest
        .spyOn(categoryModel, 'findByIdAndUpdate')
        .mockResolvedValue(updatedCategory as any);

      const result = await service.update(
        mockCategoryData._id,
        partialUpdate as UpdateCategoryDto,
      );

      expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: mockCategoryData._id },
        partialUpdate,
      );
      expect(result.name).toBe('Partial Update');
    });

    it('should handle validation errors', async () => {
      jest
        .spyOn(categoryModel, 'findByIdAndUpdate')
        .mockRejectedValue(new Error('Validation failed'));

      await expect(
        service.update(mockCategoryData._id, mockUpdateCategoryDto),
      ).rejects.toThrow('Validation failed');
    });
  });

  describe('delete', () => {
    it('should delete category successfully', async () => {
      const deleteResult = { acknowledged: true, deletedCount: 1 };
      jest
        .spyOn(categoryModel, 'deleteOne')
        .mockResolvedValue(deleteResult as any);

      const result = await service.delete(mockCategoryData._id);

      expect(categoryModel.deleteOne).toHaveBeenCalledWith({
        _id: mockCategoryData._id,
      });
      expect(result).toEqual(deleteResult);
    });

    it('should return delete result with deletedCount 0 for non-existent category', async () => {
      const deleteResult = { acknowledged: true, deletedCount: 0 };
      jest
        .spyOn(categoryModel, 'deleteOne')
        .mockResolvedValue(deleteResult as any);

      const result = await service.delete('non-existent-id');

      expect(categoryModel.deleteOne).toHaveBeenCalledWith({
        _id: 'non-existent-id',
      });
      expect(result.deletedCount).toBe(0);
    });

    it('should handle database errors', async () => {
      jest
        .spyOn(categoryModel, 'deleteOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.delete(mockCategoryData._id)).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle invalid id format', async () => {
      jest
        .spyOn(categoryModel, 'deleteOne')
        .mockRejectedValue(new Error('Invalid ObjectId'));

      await expect(service.delete('invalid-id')).rejects.toThrow(
        'Invalid ObjectId',
      );
    });
  });

  describe('datatable', () => {
    const mockDatatableParams = {
      order: [{ column: 0, dir: 'asc', name: 'name' }],
      columns: [{ data: 'name' }],
      filters: { status: CategoryStatus.ACTIVE },
      search: 'Tech',
      limit: 10,
      start: 0,
    };

    const mockQueryChain = {
      find: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    beforeEach(() => {
      jest.spyOn(categoryModel, 'countDocuments').mockResolvedValue(5);
      jest.spyOn(categoryModel, 'find').mockReturnValue(mockQueryChain as any);
    });

    it('should return datatable data successfully', async () => {
      const mockResults = [
        {
          ...mockCategoryData,
          toObject: () => mockCategoryData,
        },
      ];
      mockQueryChain.exec.mockResolvedValue(mockResults);

      const result = await service.datatable(
        mockDatatableParams.order,
        mockDatatableParams.columns,
        mockDatatableParams.filters,
        mockDatatableParams.search,
        mockDatatableParams.limit,
        mockDatatableParams.start,
      );

      expect(result).toHaveProperty('recordsTotal');
      expect(result).toHaveProperty('recordsFiltered');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('actions');
    });

    it('should handle empty search query', async () => {
      mockQueryChain.exec.mockResolvedValue([mockCategoryData]);

      const result = await service.datatable([], [], {}, '', 10, 0);

      expect(categoryModel.find).toHaveBeenCalled();
      expect(result).toHaveProperty('data');
    });

    it('should apply search filters correctly', async () => {
      mockQueryChain.exec.mockResolvedValue([mockCategoryData]);

      await service.datatable([], [], {}, 'Technology', 10, 0);

      expect(categoryModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: [{ name: expect.any(RegExp) }],
        }),
        'name',
      );
    });

    it('should apply status filters correctly', async () => {
      mockQueryChain.exec.mockResolvedValue([mockCategoryData]);

      await service.datatable(
        [],
        [],
        { status: CategoryStatus.INACTIVE },
        '',
        10,
        0,
      );

      expect(categoryModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: CategoryStatus.INACTIVE,
        }),
        'name',
      );
    });

    it('should apply sorting correctly', async () => {
      mockQueryChain.exec.mockResolvedValue([mockCategoryData]);

      await service.datatable(
        [{ column: 0, dir: 'desc', name: 'name' }],
        [{ data: 'name' }],
        {},
        '',
        10,
        0,
      );

      expect(mockQueryChain.sort).toHaveBeenCalledWith({ name: -1 });
    });

    it('should apply pagination correctly', async () => {
      mockQueryChain.exec.mockResolvedValue([mockCategoryData]);

      await service.datatable([], [], {}, '', 25, 50);

      expect(mockQueryChain.skip).toHaveBeenCalledWith(50);
      expect(mockQueryChain.limit).toHaveBeenCalledWith(25);
    });

    it('should include action buttons in results', async () => {
      const mockResults = [
        {
          _id: 'test-id',
          name: 'Test Category',
          toObject: () => ({ _id: 'test-id', name: 'Test Category' }),
        },
      ];
      mockQueryChain.exec.mockResolvedValue(mockResults);

      const result = await service.datatable([], [], {}, '', 10, 0);

      expect(result.data[0].actions).toEqual([
        {
          id: 1,
          label: 'Edit',
          type: 'link',
          endpoint: '/admin/categories/test-id',
        },
        {
          id: 2,
          label: 'Delete',
          type: 'delete',
          endpoint: 'http://localhost:3000/api/categories/test-id',
          confirm_message: 'Are you sure want to delete?',
        },
      ]);
    });

    it('should handle database errors', async () => {
      jest
        .spyOn(categoryModel, 'countDocuments')
        .mockRejectedValue(new Error('Database error'));

      const result = await service.datatable([], [], {}, '', 10, 0);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Database error');
    });

    it('should return correct counts', async () => {
      jest
        .spyOn(categoryModel, 'countDocuments')
        .mockResolvedValueOnce(100) // total count
        .mockResolvedValueOnce(20); // filtered count
      mockQueryChain.exec.mockResolvedValue([mockCategoryData]);

      const result = await service.datatable([], [], {}, 'search', 10, 0);

      expect(result.recordsTotal).toBe(100);
      expect(result.recordsFiltered).toBe(20);
    });

    it('should use default sorting when no order provided', async () => {
      mockQueryChain.exec.mockResolvedValue([mockCategoryData]);

      await service.datatable([], [], {}, '', 10, 0);

      expect(mockQueryChain.sort).toHaveBeenCalledWith({ created_at: -1 });
    });
  });
});
