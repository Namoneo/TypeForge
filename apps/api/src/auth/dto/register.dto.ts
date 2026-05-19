import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Username may only contain letters, numbers, underscores, hyphens' })
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
