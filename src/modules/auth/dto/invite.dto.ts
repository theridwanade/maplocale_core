import { IsEmail, IsOptional, IsString } from "class-validator";
import { Role } from "src/prisma/generated/enums";

export class InviteDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  role: Role;
}
