import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateSessionDto } from "./dto/CreateSession.dto";
import type { JwtPayload } from "src/common/types/jwt-payload.type";
import { SessionService } from "./session.service";
import { IngestSessionDto } from "./dto/InjestSession.dto";

@Controller("sessions")
@UseGuards(JwtAuthGuard, RolesGuard)
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

  @Post(":sessionId/ingest")
  @Roles("CONTRIBUTOR", "ADMIN")
  ingestSession(
    @Param("sessionId") sessionId: string,
    @Body() dto: IngestSessionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.sessionService.ingestSession(sessionId, dto, user.sub);
  }
}
