import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Param,
  Res,
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
      maxAge: 24 * 60 * 60 * 1000, // 1 day
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
}
