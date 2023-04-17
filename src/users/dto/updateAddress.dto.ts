import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

class UpdateAddressDto {
  @IsNumber()
  @IsOptional()
  public id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public street: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public city: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public country: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public postalCode: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public telephone: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public mobile: string;
}

export default UpdateAddressDto;
