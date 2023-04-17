import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { IsUniqueEmail } from '../../validators/IsUniqueEmail.validator';

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @IsUniqueEmail()
  @Matches('[a-z0-9]+@[a-z]+.[a-z]{2,3}')
  email: string;
}

export default ChangeEmailDto;
