import { Module } from "@nestjs/common";
import { ModulesModule } from "./modules/modules.module";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [ConfigModule, ModulesModule],
})
export class AppModule {}
