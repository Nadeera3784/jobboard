import { IsIn, IsNotEmpty, IsMongoId } from 'class-validator';

export class UpdateCountDto {
  @IsNotEmpty()
  @IsMongoId()
  job: string;

  @IsNotEmpty()
  @IsIn(['view_count', 'application_count'])
  type: string;
}
