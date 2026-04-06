import { Module } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { SessionService } from "./session.service";

@Module({
  controllers: [SessionController],
  providers: [PrismaService, SessionService],
})
export class SessionModule {}
