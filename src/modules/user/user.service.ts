import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { Role } from "src/prisma/generated/enums";

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
    role?: Role;
  }) {
    return this.prismaService.user.create({
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role ?? "CONTRIBUTOR",
      },
    });
  }

  async createInvitation(
    email: string,
    userId: string,
    token: string,
    expiresAt: Date,
  ) {
    return await this.prismaService.invitation.create({
      data: {
        email,
        userId: userId,
        token,
        expiresAt,
      },
    });
  }

  async getInvitationByToken(token: string) {
    return await this.prismaService.invitation.findUnique({
      where: { token },
    });
  }

  async updateUserPassword(userId: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prismaService.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isActive: true,
      },
    });
  }

  async updateUserInvitation(token: string, data: { used?: boolean }) {
    return await this.prismaService.invitation.update({
      where: { token },
      data,
    });
  }

  async createPasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ) {
    return await this.prismaService.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async getPasswordResetToken(token: string) {
    return await this.prismaService.passwordResetToken.findUnique({
      where: { token },
    });
  }

  async deletePasswordResetToken(token: string) {
    return await this.prismaService.passwordResetToken.delete({
      where: { token },
    });
  }

  async getUserById(userId: string) {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
