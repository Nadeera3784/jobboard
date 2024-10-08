import mongoose, { Types } from 'mongoose';
import * as crypto from 'crypto';
import PasswordValidator = require('password-validator');
import * as bcrypt from 'bcrypt';

import { FilterOption, JobFilterInterface } from '../../job/interfaces';
import { ValidationError } from 'class-validator';

export class UtilityService {
  public static parseJson<T>(input: any): T {
    return JSON.parse(input) as T;
  }

  public static processSearchFilter(
    filter: JobFilterInterface,
  ): Partial<JobFilterInterface> {
    const processedFilter: Partial<JobFilterInterface> = {};
    for (const [key, value] of Object.entries(filter)) {
      if (value && typeof value === 'object') {
        processedFilter[key] = this.processFilterOption(value as FilterOption);
      } else {
        processedFilter[key] = value;
      }
    }
    return processedFilter;
  }

  public static getRandomEntity(data: string[]): string | undefined {
    if (data.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }

  public static transformToObjectId<T extends Record<string, string>>(
    inputObject: JobFilterInterface,
    keysToConvert: string[],
  ): Record<keyof T, Types.ObjectId | string> {
    const convertedObject: Record<keyof T, Types.ObjectId | string> =
      {} as Record<keyof T, Types.ObjectId | string>;
    for (const [key, value] of Object.entries(inputObject)) {
      if (keysToConvert.includes(key) && value !== '') {
        convertedObject[key as keyof T] = new mongoose.Types.ObjectId(value);
      } else if (value !== '') {
        convertedObject[key as keyof T] = value;
      }
    }
    return convertedObject;
  }

  public static ArrayElementToString<T>(arr: T[], propName: keyof T): string[] {
    return arr.map((obj) => obj[propName].toString());
  }

  public static isValidString(str: string): boolean {
    return str && !!str.trim();
  }

  public static encodeUsersIpAddress(
    ipAddress: string,
    userEmail: string,
  ): string {
    if (!ipAddress) {
      return '';
    }
    const hashedValue: string = userEmail ? ipAddress + userEmail : ipAddress;
    return crypto.createHash('md5').update(hashedValue).digest('hex');
  }

  public static passwordSchema = () => {
    const passwordSchema: any = new PasswordValidator();
    return passwordSchema
      .is()
      .min(6)
      .is()
      .max(32)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .symbols()
      .has()
      .digits()
      .has()
      .not()
      .spaces();
  };

  public static async isPasswordValid(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  public static generateHash(word: string): string | undefined {
    if (!word) {
      return;
    }
    const salt = '64bf4dc3-96a7-4484-9744-d368b972e50e';
    return crypto
      .createHash('sha256')
      .update(salt + word)
      .digest('hex');
  }

  public static stringFied(errors: ValidationError[]): string {
    return JSON.stringify(errors);
  }

  public static processFilterOption(option: FilterOption): FilterOption {
    return {
      _id: option._id,
      name: option.name,
    };
  }
}
