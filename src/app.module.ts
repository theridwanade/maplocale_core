import { Module } from "@nestjs/common";
import { ModulesModule } from "./modules/modules.module";
import { ConfigModule } from "./config/config.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";

@Module({
  imports: [ConfigModule, ModulesModule, PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
