import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import morgan from "morgan";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan("dev"));

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
  });
}

void bootstrap();
