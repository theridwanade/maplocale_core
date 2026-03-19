import { Injectable } from "@nestjs/common";
import { PrismaClient } from "./generated/client";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";
import { TypedConfigService } from "src/config/typed-config.service";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: TypedConfigService) {
    const adapter = new PrismaPostgresAdapter({
      connectionString: configService.get("DATABASE_URL"),
    });
    super({ adapter });
  }
}
