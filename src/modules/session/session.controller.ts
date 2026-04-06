import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateSessionDto } from "./dto/CreateSession.dto";
import type { JwtPayload } from "src/common/types/jwt-payload.type";
import { SessionService } from "./session.service";

@Controller("sessions")
@UseGuards(JwtAuthGuard, RolesGuard) // move guards here, applies to all routes
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  @Post()
  @Roles("CONTRIBUTOR", "ADMIN")
  createSession(
    @Body() dto: CreateSessionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.sessionService.createSession(dto, user.sub);
  }
}
