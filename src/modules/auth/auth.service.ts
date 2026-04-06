import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { InviteDto } from "./dto/invite.dto";
import { v4 as uuidv4 } from "uuid";
import { EmailService } from "../email/email.service";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException(
        `User with this email: ${loginDto.email} not found`,
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        `User is not active, contact admin to activate account!`,
      );
    }

    const isPasswordValid = await this.userService.validatePassword(
      loginDto.password,
      user.password!,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid password`);
    }

    const { password, ...result } = user;
    return result;
  }

  login(user: UserDto) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async inviteUser(inviteDto: InviteDto) {
    const user = await this.userService.createUserRecord({
      email: inviteDto.email,
      firstName: inviteDto.firstName,
      lastName: inviteDto.lastName,
      role: inviteDto.role,
    });
    const inviteLink = await this.generateInviteLink(inviteDto.email, user.id);
    const emailResult = await this.emailService.sendContributorInvite(
      inviteDto.email,
      inviteLink.token,
      inviteLink.expiresAt,
    );

    if (!emailResult) {
      throw new InternalServerErrorException(`Failed to send invite email`);
    }
    return {
      message: `Invite sent to ${inviteDto.email}`,
    };
  }

  async generateInviteLink(contributorEmail: string, userId: string) {
    const inviteToken = uuidv4();
    const invitation = await this.userService.createInvitation(
      contributorEmail,
      userId,
      inviteToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );
    return {
      token: invitation.token,
      expiresAt: invitation.expiresAt,
    };
  }

  async handleInviteByToken(token: string, password: string) {
    const invitation = await this.userService.getInvitationByToken(token);
    if (!invitation) {
      throw new NotFoundException(`Invalid or expired invite token`);
    }
    const isTokenValid = new Date() <= invitation.expiresAt;
    if (!isTokenValid) {
      throw new NotFoundException(
        `Invalid or expired invite token, ask admin to send an invite again`,
      );
    }
    await this.userService.updateUserPassword(invitation.userId!, password);
    await this.userService.updateUserInvitation(token, { used: true });
    return {
      message: `User registered successfully, proceed to login`,
    };
  }

  async requestPasswordResetToken(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const { token } = await this.generatePasswordResetToken(user.id);
    await this.emailService.sendPasswordReset(email, token);
    return {
      message: `Password reset link sent to your email`,
    };
  }

  async generatePasswordResetToken(userId: string) {
    const token = uuidv4();
    const passwordResetToken = await this.userService.createPasswordResetToken(
      userId,
      token,
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );

    return {
      token: passwordResetToken.token,
    };
  }

  async resetPassword(token: string, password: string) {
    const passwordResetToken =
      await this.userService.getPasswordResetToken(token);
    if (!passwordResetToken) {
      throw new NotFoundException(`Invalid or expired password reset token`);
    }
    const isTokenValid = new Date() <= passwordResetToken.expiresAt;
    if (!isTokenValid) {
      throw new NotFoundException(`Invalid or expired password reset token`);
    }
    await this.userService.updateUserPassword(
      passwordResetToken.userId,
      password,
    );
    await this.userService.deletePasswordResetToken(token);
    return {
      message: `Password reset successfully, proceed to login`,
    };
  }

  async getMe(userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const { password, ...result } = user;
    return result;
  }
}
