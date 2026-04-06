import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSessionDto } from "./dto/CreateSession.dto";

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}
  createSession(dto: CreateSessionDto, userId: string) {
    const session = this.prisma.mappingSession.create({
      data: {
        userId: userId,
        name: dto.name,
        mappingMode: dto.mappingMode,
      },
    });

    return session;
  }
}
