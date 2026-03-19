import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Config } from "./config.schema";

@Injectable()
export class TypedConfigService {
  constructor(private configService: ConfigService<Config, true>) {}

  get<T extends keyof Config>(key: T): Config[T] {
    return this.configService.get(key, { infer: true });
  }

  getOrThrow<T extends keyof Config>(key: T): Config[T] {
    return this.configService.getOrThrow(key, { infer: true });
  }

  isDevelopment(): boolean {
    return this.get("NODE_ENV") === "development";
  }

  isProduction(): boolean {
    return this.get("NODE_ENV") === "production";
  }
}
