import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { TypedConfigService } from "src/config/typed-config.service";
import { EmailService } from "../email/email.service";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: TypedConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
      inject: [TypedConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    EmailService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
