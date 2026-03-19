import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AuthService } from "./modules/auth/auth.service";
import { UserService } from "./modules/user/user.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const userService = app.get(UserService);

  // Check if admin user already exists
  const existingUser = await userService.getUserByEmail(
    "theridwanade@gmail.com",
  );

  if (!existingUser) {
    await authService.inviteUser({
      email: "theridwanade@gmail.com",
      firstName: "Ridwan",
      lastName: "Oyeniyi",
      role: "ADMIN",
    });
    console.log("✅ Admin user created and invitation sent");
  } else {
    console.log("✅ Admin user already exists");
  }

  await app.close();
}

void bootstrap();
