import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import morgan from "morgan";
import { TypedConfigService } from "./config/typed-config.service";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan("dev"));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  });
  const configService = app.get(TypedConfigService);

  await app.listen(configService.get("PORT"), () => {
    console.log(
      `Server is listening at http://localhost:${configService.get("PORT")}`,
    );
  });
}

void bootstrap();
