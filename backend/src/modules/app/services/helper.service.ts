import mongoose, { Types } from 'mongoose';
import { JobFilterInterface } from '../../job/interfaces';
import * as crypto from 'crypto';

export function parseJson<T>(input: any): T {
  return JSON.parse(input) as T;
}

export function getRandomEntity(data: string[]): string | undefined {
  if (data.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

export function transformToObjectId<T extends Record<string, string>>(
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

export function ArrayElementToString<T>(arr: T[], propName: keyof T): string[] {
  return arr.map((obj) => obj[propName].toString());
}

export function isValidString(str: string): boolean {
  return str && !!str.trim();
}

export function encodeUsersIpAddress(
  ipAddress: string,
  userEmail: string,
): string {
  if (!ipAddress) {
    return '';
  }
  const hashedValue: string = userEmail ? ipAddress + userEmail : ipAddress;
  return crypto.createHash('md5').update(hashedValue).digest('hex');
}
