import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
  Param,
  Res,
  BadRequestException,
} from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { InviteDto } from "./dto/invite.dto";
import { AuthService } from "./auth.service";
import { TypedConfigService } from "src/config/typed-config.service";
import type { Response } from "express";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: TypedConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token, user } = this.authService.login(req.user);
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day requires login each day for session tracing auth
      path: "/",
    });

    return { user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Post("invite")
  async invite(@Body() inviteDto: InviteDto) {
    return await this.authService.inviteUser(inviteDto);
  }

  @Post("invite/:token")
  async inviteByToken(
    @Param("token") token: string,
    @Body() body: { password: string },
  ) {
    return await this.authService.handleInviteByToken(token, body.password);
  }

  @Post("password-reset/request")
  async requestPasswordReset(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException(`Email is required`);
    }
    return await this.authService.requestPasswordResetToken(body.email);
  }

  @Post("password-reset/:token")
  async resetPassword(
    @Param("token") token: string,
    @Body() body: { password: string },
  ) {
    return await this.authService.resetPassword(token, body.password);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req, @Res({ passthrough: true }) res: Response) {
    return await this.authService.getMe(req.user.sub);
  }

  @Get("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", { path: "/" });
    return { message: "Logged out successfully" };
  }
}
