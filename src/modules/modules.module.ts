import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  imports: [AuthModule, UserModule],
  controllers: [],
  providers: [PrismaService],
})
export class ModulesModule {}
