import { IsEmail, IsOptional, IsString } from "class-validator";

export class InviteDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;
}
