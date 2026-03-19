import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PrismaService } from "src/prisma/prisma.service";
import { EmailModule } from "./email/email.module";

@Module({
  imports: [AuthModule, UserModule, EmailModule],
  controllers: [],
  providers: [PrismaService],
})
export class ModulesModule {}
