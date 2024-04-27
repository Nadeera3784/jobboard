import { IsNotEmpty, IsString } from 'class-validator';

export class KeyValueDTO {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
