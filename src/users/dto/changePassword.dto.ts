import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { IsMatchPassword } from '../../validators/IsMatchPassword.validator';

export class ChangePassword {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @IsMatchPassword('newPassword')
  newPasswordConfirm: string;
}

export default ChangePassword;
