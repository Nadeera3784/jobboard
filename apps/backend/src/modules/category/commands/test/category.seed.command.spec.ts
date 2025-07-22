import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { CategorySeedCommand } from '../category.seed.command';
import { Category } from '../../schemas/category.schema';
import { CategoryStatus } from '../../enums/category-status.enum';

jest.mock('@faker-js/faker', () => ({
  faker: {
    person: {
      firstName: jest.fn(),
    },
  },
}));

describe('CategorySeedCommand', () => {
  let command: CategorySeedCommand;
  let categoryModel: Model<Category>;
  let loggerSpy: jest.SpyInstance;

  const { faker } = require('@faker-js/faker');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategorySeedCommand,
        {
          provide: getModelToken(Category.name),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    command = module.get<CategorySeedCommand>(CategorySeedCommand);
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));

    loggerSpy = jest.spyOn(Logger, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('run', () => {
    it('should seed 20 categories successfully', async () => {
      const mockCategoryNames = [
        'Technology',
        'Science',
        'Health',
        'Education',
        'Finance',
        'Marketing',
        'Engineering',
        'Design',
        'Sales',
        'Management',
        'Operations',
        'Research',
        'Development',
        'Consulting',
        'Accounting',
        'Legal',
        'Human Resources',
        'Production',
        'Quality',
        'Analytics',
      ];

      faker.person.firstName
        .mockImplementationOnce(() => mockCategoryNames[0])
        .mockImplementationOnce(() => mockCategoryNames[1])
        .mockImplementationOnce(() => mockCategoryNames[2])
        .mockImplementationOnce(() => mockCategoryNames[3])
        .mockImplementationOnce(() => mockCategoryNames[4])
        .mockImplementationOnce(() => mockCategoryNames[5])
        .mockImplementationOnce(() => mockCategoryNames[6])
        .mockImplementationOnce(() => mockCategoryNames[7])
        .mockImplementationOnce(() => mockCategoryNames[8])
        .mockImplementationOnce(() => mockCategoryNames[9])
        .mockImplementationOnce(() => mockCategoryNames[10])
        .mockImplementationOnce(() => mockCategoryNames[11])
        .mockImplementationOnce(() => mockCategoryNames[12])
        .mockImplementationOnce(() => mockCategoryNames[13])
        .mockImplementationOnce(() => mockCategoryNames[14])
        .mockImplementationOnce(() => mockCategoryNames[15])
        .mockImplementationOnce(() => mockCategoryNames[16])
        .mockImplementationOnce(() => mockCategoryNames[17])
        .mockImplementationOnce(() => mockCategoryNames[18])
        .mockImplementationOnce(() => mockCategoryNames[19]);

      jest.spyOn(categoryModel, 'create').mockResolvedValue({
        name: 'Test Category',
        status: CategoryStatus.ACTIVE,
      } as any);

      await command.run();

      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Category seeding started',
      });
      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Category seeding completed',
      });
      expect(categoryModel.create).toHaveBeenCalledTimes(20);

      for (let i = 0; i < 20; i++) {
        expect(categoryModel.create).toHaveBeenNthCalledWith(i + 1, {
          name: mockCategoryNames[i],
          status: 'Active',
        });
      }
    });

    it('should handle database errors during seeding', async () => {
      faker.person.firstName.mockReturnValue('Test Category');
      jest
        .spyOn(categoryModel, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(command.run()).rejects.toThrow('Database error');

      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Category seeding started',
      });
      expect(categoryModel.create).toHaveBeenCalledWith({
        name: 'Test Category',
        status: 'Active',
      });
      expect(loggerSpy).not.toHaveBeenCalledWith({
        message: 'Category seeding completed',
      });
    });

    it('should handle partial failures during seeding', async () => {
      faker.person.firstName.mockReturnValue('Test Category');

      jest
        .spyOn(categoryModel, 'create')
        .mockResolvedValueOnce({
          name: 'Test Category 1',
          status: CategoryStatus.ACTIVE,
        } as any)
        .mockResolvedValueOnce({
          name: 'Test Category 2',
          status: CategoryStatus.ACTIVE,
        } as any)
        .mockResolvedValueOnce({
          name: 'Test Category 3',
          status: CategoryStatus.ACTIVE,
        } as any)
        .mockResolvedValueOnce({
          name: 'Test Category 4',
          status: CategoryStatus.ACTIVE,
        } as any)
        .mockResolvedValueOnce({
          name: 'Test Category 5',
          status: CategoryStatus.ACTIVE,
        } as any)
        .mockRejectedValue(new Error('Database constraint violation'));

      await expect(command.run()).rejects.toThrow(
        'Database constraint violation',
      );

      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Category seeding started',
      });
      expect(categoryModel.create).toHaveBeenCalledTimes(6);
      expect(loggerSpy).not.toHaveBeenCalledWith({
        message: 'Category seeding completed',
      });
    });

    it('should handle duplicate name errors', async () => {
      faker.person.firstName.mockReturnValue('Duplicate Category');
      jest
        .spyOn(categoryModel, 'create')
        .mockRejectedValue(new Error('Duplicate key error'));

      await expect(command.run()).rejects.toThrow('Duplicate key error');

      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Category seeding started',
      });
      expect(categoryModel.create).toHaveBeenCalledWith({
        name: 'Duplicate Category',
        status: 'Active',
      });
    });

    it('should use faker to generate unique names', async () => {
      const uniqueNames = Array.from(
        { length: 20 },
        (_, i) => `UniqueCategory${i + 1}`,
      );

      // Mock faker to return unique names
      uniqueNames.forEach((name, index) => {
        faker.person.firstName.mockImplementationOnce(() => name);
      });

      jest.spyOn(categoryModel, 'create').mockResolvedValue({
        name: 'Test',
        status: CategoryStatus.ACTIVE,
      } as any);

      await command.run();

      uniqueNames.forEach((name, index) => {
        expect(categoryModel.create).toHaveBeenNthCalledWith(index + 1, {
          name: name,
          status: 'Active',
        });
      });

      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Category seeding completed',
      });
    });

    it('should log start and completion messages', async () => {
      faker.person.firstName.mockReturnValue('Test Category');
      jest.spyOn(categoryModel, 'create').mockResolvedValue({
        name: 'Test Category',
        status: CategoryStatus.ACTIVE,
      } as any);

      await command.run();

      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Category seeding started',
      });
      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Category seeding completed',
      });
      expect(loggerSpy).toHaveBeenCalledTimes(2);
    });

    it('should create exactly 20 categories', async () => {
      faker.person.firstName.mockReturnValue('Test Category');
      jest.spyOn(categoryModel, 'create').mockResolvedValue({
        name: 'Test Category',
        status: CategoryStatus.ACTIVE,
      } as any);

      await command.run();

      expect(categoryModel.create).toHaveBeenCalledTimes(20);
    });

    it('should set status to Active for all categories', async () => {
      faker.person.firstName.mockReturnValue('Test Category');
      jest.spyOn(categoryModel, 'create').mockResolvedValue({
        name: 'Test Category',
        status: CategoryStatus.ACTIVE,
      } as any);

      await command.run();

      for (let i = 1; i <= 20; i++) {
        expect(categoryModel.create).toHaveBeenNthCalledWith(
          i,
          expect.objectContaining({
            status: 'Active',
          }),
        );
      }
    });

    it('should handle network timeout errors', async () => {
      faker.person.firstName.mockReturnValue('Test Category');
      jest
        .spyOn(categoryModel, 'create')
        .mockRejectedValue(new Error('Network timeout'));

      await expect(command.run()).rejects.toThrow('Network timeout');

      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Category seeding started',
      });
      expect(categoryModel.create).toHaveBeenCalledWith({
        name: 'Test Category',
        status: 'Active',
      });
    });

    it('should handle connection refused errors', async () => {
      faker.person.firstName.mockReturnValue('Test Category');
      jest
        .spyOn(categoryModel, 'create')
        .mockRejectedValue(new Error('Connection refused'));

      await expect(command.run()).rejects.toThrow('Connection refused');

      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Category seeding started',
      });
      expect(loggerSpy).not.toHaveBeenCalledWith({
        message: 'Category seeding completed',
      });
    });
  });
});
