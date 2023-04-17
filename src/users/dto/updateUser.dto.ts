import { IsString, IsNumber, IsNotEmpty, IsAlpha, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  telephone: string;
}

export default UpdateUserDto;
