import mongoose, { Types } from 'mongoose';
import * as crypto from 'crypto';
import PasswordValidator = require('password-validator');

import { JobFilterInterface } from '../../job/interfaces';

export class UtilityService {
  public static parseJson<T>(input: any): T {
    return JSON.parse(input) as T;
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
}
