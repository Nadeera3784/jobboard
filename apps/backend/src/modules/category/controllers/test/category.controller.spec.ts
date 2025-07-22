import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { createResponse, MockResponse } from 'node-mocks-http';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { CategoryController } from '../category.controller';
import {
  CreateCategoryFeature,
  DatatableFeature,
  DeleteCategoryFeature,
  GetAllCategoriesFeature,
  GetCategoryByIdFeature,
  UpdateCategorynFeature,
} from '../../features';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos';
import { CategoryStatus } from '../../enums/category-status.enum';
import { IdDto } from '../../../app/dtos/Id.dto';
import { AuthenticationGuard } from '../../../authentication/guards/authentication.guard';
import { RoleGuard } from '../../../authentication/guards/role.guard';
import { UserService } from '../../../user/services/user.service';
import { Reflector } from '@nestjs/core';

describe('CategoryController', () => {
  let controller: CategoryController;
  let createCategoryFeature: CreateCategoryFeature;
  let updateCategorynFeature: UpdateCategorynFeature;
  let deleteCategoryFeature: DeleteCategoryFeature;
  let getAllCategoriesFeature: GetAllCategoriesFeature;
  let getCategoryByIdFeature: GetCategoryByIdFeature;
  let datatableFeature: DatatableFeature;
  let response: MockResponse<Response>;

  const mockCategoryData = {
    _id: '66082529899034a393c5a963',
    name: 'Technology',
    status: CategoryStatus.ACTIVE,
    created_at: new Date(),
  };

  const mockFeatureResponse = {
    status: HttpStatus.OK,
    response: {
      statusCode: HttpStatus.OK,
      message: null,
      data: mockCategoryData,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CreateCategoryFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: UpdateCategorynFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: DeleteCategoryFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: GetAllCategoriesFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: GetCategoryByIdFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: DatatableFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: AuthenticationGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: RoleGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndMerge: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    createCategoryFeature = module.get<CreateCategoryFeature>(
      CreateCategoryFeature,
    );
    updateCategorynFeature = module.get<UpdateCategorynFeature>(
      UpdateCategorynFeature,
    );
    deleteCategoryFeature = module.get<DeleteCategoryFeature>(
      DeleteCategoryFeature,
    );
    getAllCategoriesFeature = module.get<GetAllCategoriesFeature>(
      GetAllCategoriesFeature,
    );
    getCategoryByIdFeature = module.get<GetCategoryByIdFeature>(
      GetCategoryByIdFeature,
    );
    datatableFeature = module.get<DatatableFeature>(DatatableFeature);
    response = createResponse();

    response.status = jest.fn().mockReturnThis();
    response.json = jest.fn().mockReturnThis();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all categories successfully', async () => {
      const mockAllCategoriesResponse = {
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: null,
          data: [mockCategoryData],
        },
      };

      jest
        .spyOn(getAllCategoriesFeature, 'handle')
        .mockResolvedValue(mockAllCategoriesResponse);

      await controller.getAll(response);

      expect(getAllCategoriesFeature.handle).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(
        mockAllCategoriesResponse.response,
      );
    });

    it('should handle getAllCategoriesFeature errors', async () => {
      const mockErrorResponse = {
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong',
          data: null,
        },
      };

      jest
        .spyOn(getAllCategoriesFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.getAll(response);

      expect(getAllCategoriesFeature.handle).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });
  });

  describe('getById', () => {
    it('should get category by id successfully', async () => {
      const idDto = plainToInstance(IdDto, { id: mockCategoryData._id });

      jest
        .spyOn(getCategoryByIdFeature, 'handle')
        .mockResolvedValue(mockFeatureResponse);

      await controller.getById(response, idDto);

      expect(getCategoryByIdFeature.handle).toHaveBeenCalledWith(
        mockCategoryData._id,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockFeatureResponse.response);
    });

    it('should handle getCategoryByIdFeature errors', async () => {
      const idDto = plainToInstance(IdDto, { id: 'invalid-id' });
      const mockErrorResponse = {
        status: HttpStatus.NOT_FOUND,
        response: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category not found',
          data: null,
        },
      };

      jest
        .spyOn(getCategoryByIdFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.getById(response, idDto);

      expect(getCategoryByIdFeature.handle).toHaveBeenCalledWith('invalid-id');
      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });

    it('should handle empty id parameter', async () => {
      const idDto = plainToInstance(IdDto, { id: '' });

      jest.spyOn(getCategoryByIdFeature, 'handle').mockResolvedValue({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid ID provided',
          data: null,
        },
      });

      await controller.getById(response, idDto);

      expect(getCategoryByIdFeature.handle).toHaveBeenCalledWith('');
    });
  });

  describe('create', () => {
    it('should create category successfully', async () => {
      const createCategoryDto = plainToInstance(CreateCategoryDto, {
        name: 'Science',
      });

      const mockCreateResponse = {
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'Category has been created successfully',
          data: null,
        },
      };

      jest
        .spyOn(createCategoryFeature, 'handle')
        .mockResolvedValue(mockCreateResponse);

      await controller.create(response, createCategoryDto);

      expect(createCategoryFeature.handle).toHaveBeenCalledWith(
        createCategoryDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockCreateResponse.response);
    });

    it('should handle createCategoryFeature validation errors', async () => {
      const createCategoryDto = plainToInstance(CreateCategoryDto, {
        name: '',
      });

      const mockErrorResponse = {
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          data: null,
        },
      };

      jest
        .spyOn(createCategoryFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.create(response, createCategoryDto);

      expect(createCategoryFeature.handle).toHaveBeenCalledWith(
        createCategoryDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });

    it('should handle duplicate category name', async () => {
      const createCategoryDto = plainToInstance(CreateCategoryDto, {
        name: 'Technology',
      });

      const mockErrorResponse = {
        status: HttpStatus.CONFLICT,
        response: {
          statusCode: HttpStatus.CONFLICT,
          message: 'Category with this name already exists',
          data: null,
        },
      };

      jest
        .spyOn(createCategoryFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.create(response, createCategoryDto);

      expect(createCategoryFeature.handle).toHaveBeenCalledWith(
        createCategoryDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });

    it('should handle name length validation', async () => {
      const createCategoryDto = plainToInstance(CreateCategoryDto, {
        name: 'This is a very long category name that exceeds the maximum allowed length',
      });

      const mockErrorResponse = {
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Name must be between 1 and 20 characters',
          data: null,
        },
      };

      jest
        .spyOn(createCategoryFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.create(response, createCategoryDto);

      expect(createCategoryFeature.handle).toHaveBeenCalledWith(
        createCategoryDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      const idDto = plainToInstance(IdDto, { id: mockCategoryData._id });
      const updateCategoryDto = plainToInstance(UpdateCategoryDto, {
        name: 'Updated Category',
        status: CategoryStatus.ACTIVE,
      });

      const mockUpdateResponse = {
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'Category has been updated successfully',
          data: null,
        },
      };

      jest
        .spyOn(updateCategorynFeature, 'handle')
        .mockResolvedValue(mockUpdateResponse);

      await controller.update(response, idDto, updateCategoryDto);

      expect(updateCategorynFeature.handle).toHaveBeenCalledWith(
        mockCategoryData._id,
        updateCategoryDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockUpdateResponse.response);
    });

    it('should handle updateCategorynFeature errors for non-existent category', async () => {
      const idDto = plainToInstance(IdDto, { id: 'non-existent-id' });
      const updateCategoryDto = plainToInstance(UpdateCategoryDto, {
        name: 'Updated Category',
      });

      const mockErrorResponse = {
        status: HttpStatus.NOT_FOUND,
        response: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category not found',
          data: null,
        },
      };

      jest
        .spyOn(updateCategorynFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.update(response, idDto, updateCategoryDto);

      expect(updateCategorynFeature.handle).toHaveBeenCalledWith(
        'non-existent-id',
        updateCategoryDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });

    it('should handle update with only name field', async () => {
      const idDto = plainToInstance(IdDto, { id: mockCategoryData._id });
      const updateCategoryDto = plainToInstance(UpdateCategoryDto, {
        name: 'Only Name Update',
      });

      jest
        .spyOn(updateCategorynFeature, 'handle')
        .mockResolvedValue(mockFeatureResponse);

      await controller.update(response, idDto, updateCategoryDto);

      expect(updateCategorynFeature.handle).toHaveBeenCalledWith(
        mockCategoryData._id,
        updateCategoryDto,
      );
      expect(updateCategoryDto.status).toBeUndefined();
    });

    it('should handle update with invalid status', async () => {
      const idDto = plainToInstance(IdDto, { id: mockCategoryData._id });
      const updateCategoryDto = plainToInstance(UpdateCategoryDto, {
        name: 'Updated Category',
        status: 'InvalidStatus',
      });

      const mockErrorResponse = {
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid status value',
          data: null,
        },
      };

      jest
        .spyOn(updateCategorynFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.update(response, idDto, updateCategoryDto);

      expect(updateCategorynFeature.handle).toHaveBeenCalledWith(
        mockCategoryData._id,
        updateCategoryDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('delete', () => {
    it('should delete category successfully', async () => {
      const idDto = plainToInstance(IdDto, { id: mockCategoryData._id });

      const mockDeleteResponse = {
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'Category has been deleted successfully',
          data: null,
        },
      };

      jest
        .spyOn(deleteCategoryFeature, 'handle')
        .mockResolvedValue(mockDeleteResponse);

      await controller.delete(response, idDto);

      expect(deleteCategoryFeature.handle).toHaveBeenCalledWith(
        mockCategoryData._id,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockDeleteResponse.response);
    });

    it('should handle deleteCategoryFeature errors for non-existent category', async () => {
      const idDto = plainToInstance(IdDto, { id: 'non-existent-id' });

      const mockErrorResponse = {
        status: HttpStatus.NOT_FOUND,
        response: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category not found',
          data: null,
        },
      };

      jest
        .spyOn(deleteCategoryFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.delete(response, idDto);

      expect(deleteCategoryFeature.handle).toHaveBeenCalledWith(
        'non-existent-id',
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });

    it('should handle delete with invalid id format', async () => {
      const idDto = plainToInstance(IdDto, { id: 'invalid-format' });

      const mockErrorResponse = {
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid ID format',
          data: null,
        },
      };

      jest
        .spyOn(deleteCategoryFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.delete(response, idDto);

      expect(deleteCategoryFeature.handle).toHaveBeenCalledWith(
        'invalid-format',
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });

    it('should handle delete of category with existing dependencies', async () => {
      const idDto = plainToInstance(IdDto, { id: mockCategoryData._id });

      const mockErrorResponse = {
        status: HttpStatus.CONFLICT,
        response: {
          statusCode: HttpStatus.CONFLICT,
          message: 'Cannot delete category with existing dependencies',
          data: null,
        },
      };

      jest
        .spyOn(deleteCategoryFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.delete(response, idDto);

      expect(deleteCategoryFeature.handle).toHaveBeenCalledWith(
        mockCategoryData._id,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    });
  });

  describe('dataTable', () => {
    it('should get datatable data successfully', async () => {
      const mockDatatableParams = {
        order: [{ column: 0, dir: 'asc' }],
        columns: [{ data: 'name', searchable: true }],
        filters: {},
        search: 'Tech',
        limit: 10,
        start: 0,
      };

      const mockDatatableResponse = {
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: null,
          data: {
            data: [mockCategoryData],
            recordsTotal: 1,
            recordsFiltered: 1,
          },
        },
      };

      jest
        .spyOn(datatableFeature, 'handle')
        .mockResolvedValue(mockDatatableResponse);

      await controller.dataTable(
        response,
        mockDatatableParams.order,
        mockDatatableParams.columns,
        mockDatatableParams.filters,
        mockDatatableParams.search,
        mockDatatableParams.limit,
        mockDatatableParams.start,
      );

      expect(datatableFeature.handle).toHaveBeenCalledWith(
        mockDatatableParams.order,
        mockDatatableParams.columns,
        mockDatatableParams.filters,
        mockDatatableParams.search,
        mockDatatableParams.limit,
        mockDatatableParams.start,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(
        mockDatatableResponse.response,
      );
    });

    it('should handle datatable with empty search', async () => {
      const mockDatatableParams = {
        order: [],
        columns: [],
        filters: {},
        search: '',
        limit: 25,
        start: 0,
      };

      jest
        .spyOn(datatableFeature, 'handle')
        .mockResolvedValue(mockFeatureResponse);

      await controller.dataTable(
        response,
        mockDatatableParams.order,
        mockDatatableParams.columns,
        mockDatatableParams.filters,
        mockDatatableParams.search,
        mockDatatableParams.limit,
        mockDatatableParams.start,
      );

      expect(datatableFeature.handle).toHaveBeenCalledWith(
        mockDatatableParams.order,
        mockDatatableParams.columns,
        mockDatatableParams.filters,
        '',
        25,
        0,
      );
    });

    it('should handle datatable with filtering', async () => {
      const mockDatatableParams = {
        order: [{ column: 0, dir: 'desc' }],
        columns: [{ data: 'name' }, { data: 'status' }],
        filters: { status: CategoryStatus.ACTIVE },
        search: '',
        limit: 50,
        start: 10,
      };

      jest
        .spyOn(datatableFeature, 'handle')
        .mockResolvedValue(mockFeatureResponse);

      await controller.dataTable(
        response,
        mockDatatableParams.order,
        mockDatatableParams.columns,
        mockDatatableParams.filters,
        mockDatatableParams.search,
        mockDatatableParams.limit,
        mockDatatableParams.start,
      );

      expect(datatableFeature.handle).toHaveBeenCalledWith(
        mockDatatableParams.order,
        mockDatatableParams.columns,
        mockDatatableParams.filters,
        '',
        50,
        10,
      );
    });

    it('should handle datatable feature errors', async () => {
      const mockErrorResponse = {
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Datatable query failed',
          data: null,
        },
      };

      jest
        .spyOn(datatableFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.dataTable(response, [], [], {}, '', 10, 0);

      expect(datatableFeature.handle).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });

    it('should handle datatable with pagination', async () => {
      const mockDatatableParams = {
        order: [],
        columns: [],
        filters: {},
        search: '',
        limit: 100,
        start: 200,
      };

      jest
        .spyOn(datatableFeature, 'handle')
        .mockResolvedValue(mockFeatureResponse);

      await controller.dataTable(
        response,
        mockDatatableParams.order,
        mockDatatableParams.columns,
        mockDatatableParams.filters,
        mockDatatableParams.search,
        mockDatatableParams.limit,
        mockDatatableParams.start,
      );

      expect(datatableFeature.handle).toHaveBeenCalledWith(
        [],
        [],
        {},
        '',
        100,
        200,
      );
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle feature throwing exceptions', async () => {
      jest
        .spyOn(getAllCategoriesFeature, 'handle')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.getAll(response)).rejects.toThrow(
        'Unexpected error',
      );
    });

    it('should handle malformed request data', async () => {
      const malformedDto = { invalidField: 'value' } as any;

      jest.spyOn(createCategoryFeature, 'handle').mockResolvedValue({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid request data',
          data: null,
        },
      });

      await controller.create(response, malformedDto);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });

    it('should handle null/undefined response from features', async () => {
      jest
        .spyOn(getAllCategoriesFeature, 'handle')
        .mockResolvedValue(null as any);

      await expect(controller.getAll(response)).rejects.toThrow();
    });
  });
});
