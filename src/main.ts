import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import morgan from "morgan";
import { TypedConfigService } from "./config/typed-config.service";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(TypedConfigService);
  app.use(morgan("dev"));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get("CORS_ORIGIN"),
    credentials: true,
  });

  await app.listen(configService.get("PORT"), () => {
    console.log(
      `Server is listening at http://localhost:${configService.get("PORT")}`,
    );
  });
}

void bootstrap();
