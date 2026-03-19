import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { validate } from "./config.schema";
import { TypedConfigService } from "./typed-config.service";

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      validate: validate,
      isGlobal: true,
      envFilePath: [".env", ".env.local", ".env.development"],
    }),
  ],
  providers: [TypedConfigService],
  exports: [TypedConfigService],
})
export class ConfigModule {}
