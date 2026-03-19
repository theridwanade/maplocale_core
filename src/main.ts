import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import morgan from "morgan";
import { TypedConfigService } from "./config/typed-config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan("dev"));
  const configService = app.get(TypedConfigService);

  await app.listen(configService.get("PORT"), () => {
    console.log(
      `Server is listening at http://localhost:${configService.get("PORT")}`,
    );
  });
}

void bootstrap();
