import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Param,
} from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { InviteDto } from "./dto/invite.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req) {
    return req.user;
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles("admin")
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
