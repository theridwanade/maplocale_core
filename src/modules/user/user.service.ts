import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async createUserRecord(user: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    return this.prismaService.user.create({
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }
}
