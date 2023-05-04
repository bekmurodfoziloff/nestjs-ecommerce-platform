import { IsNumberString } from 'class-validator';

class FindOneParams {
  @IsNumberString()
  id: number;
}

export default FindOneParams;
