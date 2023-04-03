import { IsString } from 'class-validator';

class FindOneParams {
  @IsString()
  id: number;
}

export default FindOneParams;
