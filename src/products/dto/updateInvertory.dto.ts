import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

class UpdateInvertoryDto {
  @IsNumber()
  @IsOptional()
  public id: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  public quantity: number;
}

export default UpdateInvertoryDto;
