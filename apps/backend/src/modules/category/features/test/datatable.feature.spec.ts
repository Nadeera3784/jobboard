import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { DatatableFeature } from '../datatable.feature';
import { CategoryService } from '../../services/category.service';
import { CategoryStatus } from '../../enums/category-status.enum';

describe('DatatableFeature', () => {
  let feature: DatatableFeature;
  let categoryService: CategoryService;

  const mockDatatableData = {
    recordsTotal: 100,
    recordsFiltered: 10,
    data: [
      {
        _id: '66082529899034a393c5a963',
        name: 'Technology',
        status: CategoryStatus.ACTIVE,
        created_at: new Date(),
        actions: [
          { id: 1, label: 'Edit', type: 'link' },
          { id: 2, label: 'Delete', type: 'delete' },
        ],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatatableFeature,
        {
          provide: CategoryService,
          useValue: {
            datatable: jest.fn(),
          },
        },
      ],
    }).compile();

    feature = module.get<DatatableFeature>(DatatableFeature);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(feature).toBeDefined();
  });

  describe('handle', () => {
    it('should return datatable data successfully', async () => {
      jest
        .spyOn(categoryService, 'datatable')
        .mockResolvedValue(mockDatatableData as any);

      const order = [{ column: 0, dir: 'asc' }];
      const columns = [{ data: 'name' }];
      const filters = { status: CategoryStatus.ACTIVE };
      const search = 'Tech';
      const limit = 10;
      const start = 0;

      const result = await feature.handle(
        order,
        columns,
        filters,
        search,
        limit,
        start,
      );

      expect(categoryService.datatable).toHaveBeenCalledWith(
        order,
        columns,
        filters,
        search,
        limit,
        start,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBeNull();
      expect(result.response.data).toEqual(mockDatatableData);
    });

    it('should handle empty search query', async () => {
      jest
        .spyOn(categoryService, 'datatable')
        .mockResolvedValue(mockDatatableData as any);

      const result = await feature.handle([], [], {}, '', 10, 0);

      expect(categoryService.datatable).toHaveBeenCalledWith(
        [],
        [],
        {},
        '',
        10,
        0,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBeNull();
      expect(result.response.data).toEqual(mockDatatableData);
    });

    it('should handle no results', async () => {
      const emptyResult = {
        recordsTotal: 0,
        recordsFiltered: 0,
        data: [],
      };
      jest
        .spyOn(categoryService, 'datatable')
        .mockResolvedValue(emptyResult as any);

      const result = await feature.handle([], [], {}, 'nonexistent', 10, 0);

      expect(categoryService.datatable).toHaveBeenCalledWith(
        [],
        [],
        {},
        'nonexistent',
        10,
        0,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.statusCode).toBe(HttpStatus.OK);
      expect(result.response.message).toBeNull();
      expect(result.response.data).toEqual(emptyResult);
    });

    it('should handle pagination parameters', async () => {
      jest
        .spyOn(categoryService, 'datatable')
        .mockResolvedValue(mockDatatableData as any);

      const result = await feature.handle([], [], {}, '', 25, 50);

      expect(categoryService.datatable).toHaveBeenCalledWith(
        [],
        [],
        {},
        '',
        25,
        50,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.data).toEqual(mockDatatableData);
    });

    it('should handle sorting parameters', async () => {
      jest
        .spyOn(categoryService, 'datatable')
        .mockResolvedValue(mockDatatableData as any);

      const order = [{ column: 0, dir: 'desc', name: 'name' }];
      const columns = [{ data: 'name' }, { data: 'status' }];

      const result = await feature.handle(order, columns, {}, '', 10, 0);

      expect(categoryService.datatable).toHaveBeenCalledWith(
        order,
        columns,
        {},
        '',
        10,
        0,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.data).toEqual(mockDatatableData);
    });

    it('should handle filter parameters', async () => {
      jest
        .spyOn(categoryService, 'datatable')
        .mockResolvedValue(mockDatatableData as any);

      const filters = {
        status: CategoryStatus.INACTIVE,
        created_at: '2024-01-01',
      };

      const result = await feature.handle([], [], filters, '', 10, 0);

      expect(categoryService.datatable).toHaveBeenCalledWith(
        [],
        [],
        filters,
        '',
        10,
        0,
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.data).toEqual(mockDatatableData);
    });

    it('should handle database errors', async () => {
      jest
        .spyOn(categoryService, 'datatable')
        .mockRejectedValue(new Error('Database connection failed'));

      const result = await feature.handle([], [], {}, '', 10, 0);

      expect(categoryService.datatable).toHaveBeenCalledWith(
        [],
        [],
        {},
        '',
        10,
        0,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle invalid parameters', async () => {
      jest
        .spyOn(categoryService, 'datatable')
        .mockRejectedValue(new Error('Invalid parameters'));

      const result = await feature.handle(null, null, null, null, -1, -1);

      expect(categoryService.datatable).toHaveBeenCalledWith(
        null,
        null,
        null,
        null,
        -1,
        -1,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should handle network timeout errors', async () => {
      jest
        .spyOn(categoryService, 'datatable')
        .mockRejectedValue(new Error('Network timeout'));

      const result = await feature.handle([], [], {}, '', 10, 0);

      expect(categoryService.datatable).toHaveBeenCalledWith(
        [],
        [],
        {},
        '',
        10,
        0,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response.message).toBe(
        'Something went wrong, Please try again later',
      );
      expect(result.response.data).toBeInstanceOf(Error);
    });

    it('should call service datatable method exactly once', async () => {
      jest
        .spyOn(categoryService, 'datatable')
        .mockResolvedValue(mockDatatableData as any);

      await feature.handle([], [], {}, '', 10, 0);

      expect(categoryService.datatable).toHaveBeenCalledTimes(1);
    });
  });
});
