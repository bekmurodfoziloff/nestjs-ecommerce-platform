import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsAlpha, Matches } from 'class-validator';
import { IsUniqueEmail } from '../../validators/IsUniqueEmail.validator';
import { IsMatchPassword } from '../../validators/IsMatchPassword.validator';

export class RegisterDto {
  @IsEmail()
  @IsUniqueEmail()
  @Matches('[a-z0-9]+@[a-z]+.[a-z]{2,3}')
  email: string;

  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @IsMatchPassword('password')
  passwordConfirm: string;
}

export default RegisterDto;
