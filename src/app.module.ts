import { Module } from "@nestjs/common";
import { ModulesModule } from "./modules/modules.module";
import { ConfigModule } from "./config/config.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [ConfigModule, ModulesModule, PrismaModule],
})
export class AppModule {}
