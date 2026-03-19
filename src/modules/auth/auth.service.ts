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
import { email } from "node_modules/zod/v4/core/regexes";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException(
        `User with this email: ${loginDto.email} not found`,
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

  async inviteUser(inviteDto: InviteDto) {
    const user = await this.userService.createUserRecord({
      email: inviteDto.email,
      firstName: inviteDto.firstName,
      lastName: inviteDto.lastName,
    });
    const inviteLink = await this.generateInviteLink(inviteDto.email);
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

  async generateInviteLink(contributorEmail: string) {
    const inviteToken = uuidv4();
    const invitation = await this.userService.createInvitation(
      contributorEmail,
      inviteToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );
    return {
      token: invitation.token,
      expiresAt: invitation.expiresAt,
    };
  }
}
