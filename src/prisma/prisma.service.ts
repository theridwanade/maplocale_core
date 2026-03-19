import { Injectable } from "@nestjs/common";
import { PrismaClient } from "./generated/client";
import { TypedConfigService } from "src/config/typed-config.service";
import { PrismaNeon } from "@prisma/adapter-neon";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: TypedConfigService) {
    const adapter = new PrismaNeon({
      connectionString: configService.get("DATABASE_URL"),
    });
    super({ adapter });
  }
}
