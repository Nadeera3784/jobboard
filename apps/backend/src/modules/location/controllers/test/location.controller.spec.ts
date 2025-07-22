import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { createResponse, MockResponse } from 'node-mocks-http';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { LocationController } from '../location.controller';
import {
  CreateLocationFeature,
  DeleteLocationFeature,
  GetAllLocationsFeature,
  GetLocationByIdFeature,
  UpdateLocationFeature,
  DatatableFeature,
} from '../../features';
import { CreateLocationDto, UpdateLocationDto } from '../../dtos';
import { LocationStatusEnum } from '../../enums';
import { IdDto } from '../../../app/dtos/Id.dto';
import { AuthenticationGuard } from '../../../authentication/guards/authentication.guard';
import { RoleGuard } from '../../../authentication/guards/role.guard';
import { UserService } from '../../../user/services/user.service';
import { Reflector } from '@nestjs/core';

describe('LocationController', () => {
  let controller: LocationController;
  let createLocationFeature: CreateLocationFeature;
  let deleteLocationFeature: DeleteLocationFeature;
  let getAllLocationsFeature: GetAllLocationsFeature;
  let getLocationByIdFeature: GetLocationByIdFeature;
  let updateLocationFeature: UpdateLocationFeature;
  let datatableFeature: DatatableFeature;
  let response: MockResponse<Response>;

  const mockLocationData = {
    _id: '66082529899034a393c5a963',
    name: 'New York',
    status: LocationStatusEnum.ACTIVE,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockFeatureResponse = {
    status: HttpStatus.OK,
    response: {
      statusCode: HttpStatus.OK,
      message: null,
      data: mockLocationData,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: CreateLocationFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: DeleteLocationFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: GetAllLocationsFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: GetLocationByIdFeature,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: UpdateLocationFeature,
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

    controller = module.get<LocationController>(LocationController);
    createLocationFeature = module.get<CreateLocationFeature>(
      CreateLocationFeature,
    );
    deleteLocationFeature = module.get<DeleteLocationFeature>(
      DeleteLocationFeature,
    );
    getAllLocationsFeature = module.get<GetAllLocationsFeature>(
      GetAllLocationsFeature,
    );
    getLocationByIdFeature = module.get<GetLocationByIdFeature>(
      GetLocationByIdFeature,
    );
    updateLocationFeature = module.get<UpdateLocationFeature>(
      UpdateLocationFeature,
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
    it('should get all locations successfully', async () => {
      const mockAllLocationsResponse = {
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: null,
          data: [mockLocationData],
        },
      };

      jest
        .spyOn(getAllLocationsFeature, 'handle')
        .mockResolvedValue(mockAllLocationsResponse);

      await controller.getAll(response);

      expect(getAllLocationsFeature.handle).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(
        mockAllLocationsResponse.response,
      );
    });

    it('should handle getAllLocationsFeature errors', async () => {
      const mockErrorResponse = {
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong',
          data: null,
        },
      };

      jest
        .spyOn(getAllLocationsFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.getAll(response);

      expect(getAllLocationsFeature.handle).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });
  });

  describe('getById', () => {
    it('should get location by id successfully', async () => {
      const idDto = plainToInstance(IdDto, { id: mockLocationData._id });

      jest
        .spyOn(getLocationByIdFeature, 'handle')
        .mockResolvedValue(mockFeatureResponse);

      await controller.getById(response, idDto);

      expect(getLocationByIdFeature.handle).toHaveBeenCalledWith(
        mockLocationData._id,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockFeatureResponse.response);
    });

    it('should handle getLocationByIdFeature errors', async () => {
      const idDto = plainToInstance(IdDto, { id: 'invalid-id' });
      const mockErrorResponse = {
        status: HttpStatus.NOT_FOUND,
        response: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Location not found',
          data: null,
        },
      };

      jest
        .spyOn(getLocationByIdFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.getById(response, idDto);

      expect(getLocationByIdFeature.handle).toHaveBeenCalledWith('invalid-id');
      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });

    it('should handle empty id parameter', async () => {
      const idDto = plainToInstance(IdDto, { id: '' });

      jest.spyOn(getLocationByIdFeature, 'handle').mockResolvedValue({
        status: HttpStatus.BAD_REQUEST,
        response: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid ID provided',
          data: null,
        },
      });

      await controller.getById(response, idDto);

      expect(getLocationByIdFeature.handle).toHaveBeenCalledWith('');
    });
  });

  describe('create', () => {
    it('should create location successfully', async () => {
      const createLocationDto = plainToInstance(CreateLocationDto, {
        name: 'Los Angeles',
      });

      const mockCreateResponse = {
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'Location has been created successfully',
          data: null,
        },
      };

      jest
        .spyOn(createLocationFeature, 'handle')
        .mockResolvedValue(mockCreateResponse);

      await controller.create(response, createLocationDto);

      expect(createLocationFeature.handle).toHaveBeenCalledWith(
        createLocationDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockCreateResponse.response);
    });

    it('should handle createLocationFeature validation errors', async () => {
      const createLocationDto = plainToInstance(CreateLocationDto, {
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
        .spyOn(createLocationFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.create(response, createLocationDto);

      expect(createLocationFeature.handle).toHaveBeenCalledWith(
        createLocationDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });

    it('should handle duplicate location name', async () => {
      const createLocationDto = plainToInstance(CreateLocationDto, {
        name: 'New York',
      });

      const mockErrorResponse = {
        status: HttpStatus.CONFLICT,
        response: {
          statusCode: HttpStatus.CONFLICT,
          message: 'Location with this name already exists',
          data: null,
        },
      };

      jest
        .spyOn(createLocationFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.create(response, createLocationDto);

      expect(createLocationFeature.handle).toHaveBeenCalledWith(
        createLocationDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });

    it('should handle name length validation', async () => {
      const createLocationDto = plainToInstance(CreateLocationDto, {
        name: 'This is a very long location name that exceeds the maximum length', // Too long
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
        .spyOn(createLocationFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.create(response, createLocationDto);

      expect(createLocationFeature.handle).toHaveBeenCalledWith(
        createLocationDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('update', () => {
    it('should update location successfully', async () => {
      const idDto = plainToInstance(IdDto, { id: mockLocationData._id });
      const updateLocationDto = plainToInstance(UpdateLocationDto, {
        name: 'Updated Location',
        status: LocationStatusEnum.ACTIVE,
      });

      const mockUpdateResponse = {
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'Location has been updated successfully',
          data: null,
        },
      };

      jest
        .spyOn(updateLocationFeature, 'handle')
        .mockResolvedValue(mockUpdateResponse);

      await controller.update(response, idDto, updateLocationDto);

      expect(updateLocationFeature.handle).toHaveBeenCalledWith(
        mockLocationData._id,
        updateLocationDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockUpdateResponse.response);
    });

    it('should handle updateLocationFeature errors for non-existent location', async () => {
      const idDto = plainToInstance(IdDto, { id: 'non-existent-id' });
      const updateLocationDto = plainToInstance(UpdateLocationDto, {
        name: 'Updated Location',
      });

      const mockErrorResponse = {
        status: HttpStatus.NOT_FOUND,
        response: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Location not found',
          data: null,
        },
      };

      jest
        .spyOn(updateLocationFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.update(response, idDto, updateLocationDto);

      expect(updateLocationFeature.handle).toHaveBeenCalledWith(
        'non-existent-id',
        updateLocationDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith(mockErrorResponse.response);
    });

    it('should handle update with only name field', async () => {
      const idDto = plainToInstance(IdDto, { id: mockLocationData._id });
      const updateLocationDto = plainToInstance(UpdateLocationDto, {
        name: 'Only Name Update',
      });

      jest
        .spyOn(updateLocationFeature, 'handle')
        .mockResolvedValue(mockFeatureResponse);

      await controller.update(response, idDto, updateLocationDto);

      expect(updateLocationFeature.handle).toHaveBeenCalledWith(
        mockLocationData._id,
        updateLocationDto,
      );
      expect(updateLocationDto.status).toBeUndefined();
    });

    it('should handle update with invalid status', async () => {
      const idDto = plainToInstance(IdDto, { id: mockLocationData._id });
      const updateLocationDto = plainToInstance(UpdateLocationDto, {
        name: 'Updated Location',
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
        .spyOn(updateLocationFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.update(response, idDto, updateLocationDto);

      expect(updateLocationFeature.handle).toHaveBeenCalledWith(
        mockLocationData._id,
        updateLocationDto,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('delete', () => {
    it('should delete location successfully', async () => {
      const idDto = plainToInstance(IdDto, { id: mockLocationData._id });

      const mockDeleteResponse = {
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: 'Location has been deleted successfully',
          data: null,
        },
      };

      jest
        .spyOn(deleteLocationFeature, 'handle')
        .mockResolvedValue(mockDeleteResponse);

      await controller.delete(response, idDto);

      expect(deleteLocationFeature.handle).toHaveBeenCalledWith(
        mockLocationData._id,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockDeleteResponse.response);
    });

    it('should handle deleteLocationFeature errors for non-existent location', async () => {
      const idDto = plainToInstance(IdDto, { id: 'non-existent-id' });

      const mockErrorResponse = {
        status: HttpStatus.NOT_FOUND,
        response: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Location not found',
          data: null,
        },
      };

      jest
        .spyOn(deleteLocationFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.delete(response, idDto);

      expect(deleteLocationFeature.handle).toHaveBeenCalledWith(
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
        .spyOn(deleteLocationFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.delete(response, idDto);

      expect(deleteLocationFeature.handle).toHaveBeenCalledWith(
        'invalid-format',
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });

    it('should handle delete of location with existing dependencies', async () => {
      const idDto = plainToInstance(IdDto, { id: mockLocationData._id });

      const mockErrorResponse = {
        status: HttpStatus.CONFLICT,
        response: {
          statusCode: HttpStatus.CONFLICT,
          message: 'Cannot delete location with existing dependencies',
          data: null,
        },
      };

      jest
        .spyOn(deleteLocationFeature, 'handle')
        .mockResolvedValue(mockErrorResponse);

      await controller.delete(response, idDto);

      expect(deleteLocationFeature.handle).toHaveBeenCalledWith(
        mockLocationData._id,
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
        search: 'New',
        limit: 10,
        start: 0,
      };

      const mockDatatableResponse = {
        status: HttpStatus.OK,
        response: {
          statusCode: HttpStatus.OK,
          message: null,
          data: {
            data: [mockLocationData],
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
        filters: { status: LocationStatusEnum.ACTIVE },
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
        .spyOn(getAllLocationsFeature, 'handle')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.getAll(response)).rejects.toThrow(
        'Unexpected error',
      );
    });

    it('should handle malformed request data', async () => {
      const malformedDto = { invalidField: 'value' } as any;

      jest.spyOn(createLocationFeature, 'handle').mockResolvedValue({
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
        .spyOn(getAllLocationsFeature, 'handle')
        .mockResolvedValue(null as any);

      await expect(controller.getAll(response)).rejects.toThrow();
    });
  });
});
