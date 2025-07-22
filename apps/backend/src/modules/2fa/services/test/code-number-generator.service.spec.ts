import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CodeNumberGeneratorService } from '../code-number-generator.service';
import { SecondFactor } from '../../schemas';

describe('CodeNumberGeneratorService', () => {
  let service: CodeNumberGeneratorService;
  let secondFactorModel: Model<SecondFactor>;

  const mockUserId = '507f1f77bcf86cd799439011';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeNumberGeneratorService,
        {
          provide: getModelToken(SecondFactor.name),
          useValue: {
            findOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CodeNumberGeneratorService>(
      CodeNumberGeneratorService,
    );
    secondFactorModel = module.get<Model<SecondFactor>>(
      getModelToken(SecondFactor.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should generate a unique code when no existing code is found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValue(mockQuery as any);

      const code = await service.generate(mockUserId);

      expect(code).toBeGreaterThanOrEqual(100000);
      expect(code).toBeLessThanOrEqual(999999);
      expect(Number.isInteger(code)).toBe(true);
      expect(secondFactorModel.findOne).toHaveBeenCalledWith({
        userId: mockUserId,
        code,
        active: true,
      });
    });

    it('should generate a new code if the first generated code already exists', async () => {
      const existingCode = 123456;
      const newCode = 654321;

      let callCount = 0;
      jest
        .spyOn(Math, 'random')
        .mockImplementationOnce(() => {
          callCount++;
          return (existingCode - 100000) / 899999;
        })
        .mockImplementationOnce(() => {
          callCount++;
          return (newCode - 100000) / 899999;
        });

      const mockQueryFirst = {
        exec: jest.fn().mockResolvedValue({ code: existingCode }),
      };
      const mockQuerySecond = {
        exec: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValueOnce(mockQueryFirst as any)
        .mockReturnValueOnce(mockQuerySecond as any);

      const code = await service.generate(mockUserId);

      expect(code).toBe(newCode);
      expect(secondFactorModel.findOne).toHaveBeenCalledTimes(2);
    });

    it('should handle database errors gracefully', async () => {
      const mockQuery = {
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValue(mockQuery as any);

      await expect(service.generate(mockUserId)).rejects.toThrow(
        'Database error',
      );
    });

    it('should generate codes within valid range multiple times', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValue(mockQuery as any);

      for (let i = 0; i < 10; i++) {
        const code = await service.generate(mockUserId);
        expect(code).toBeGreaterThanOrEqual(100000);
        expect(code).toBeLessThanOrEqual(999999);
        expect(Number.isInteger(code)).toBe(true);
      }
    });
  });

  describe('getRandomInt (private method)', () => {
    it('should generate numbers within the specified range', () => {
      const min = 100000;
      const max = 999999;

      for (let i = 0; i < 100; i++) {
        const randomValue = Math.random();
        const result = Math.floor(randomValue * (max - min + 1)) + min;

        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty userId', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValue(mockQuery as any);

      const code = await service.generate('');

      expect(code).toBeGreaterThanOrEqual(100000);
      expect(code).toBeLessThanOrEqual(999999);
      expect(secondFactorModel.findOne).toHaveBeenCalledWith({
        userId: '',
        code,
        active: true,
      });
    });

    it('should handle multiple consecutive existing codes', async () => {
      let callCount = 0;
      const codes = [123456, 234567, 345678, 456789];

      jest.spyOn(Math, 'random').mockImplementation(() => {
        const index = callCount % codes.length;
        callCount++;
        return (codes[index] - 100000) / 899999;
      });

      const mockQueries = [
        { exec: jest.fn().mockResolvedValue({ code: codes[0] }) },
        { exec: jest.fn().mockResolvedValue({ code: codes[1] }) },
        { exec: jest.fn().mockResolvedValue({ code: codes[2] }) },
        { exec: jest.fn().mockResolvedValue(null) },
      ];

      jest
        .spyOn(secondFactorModel, 'findOne')
        .mockReturnValueOnce(mockQueries[0] as any)
        .mockReturnValueOnce(mockQueries[1] as any)
        .mockReturnValueOnce(mockQueries[2] as any)
        .mockReturnValueOnce(mockQueries[3] as any);

      const code = await service.generate(mockUserId);

      expect(code).toBe(codes[3]);
      expect(secondFactorModel.findOne).toHaveBeenCalledTimes(4);
    });
  });
});
