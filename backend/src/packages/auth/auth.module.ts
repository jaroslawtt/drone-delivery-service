import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { Encrypt } from "~/libs/packages/encrypt/encrypt.js";
import { Token } from "~/libs/packages/token/token.js";
import { UserModule } from "~/packages/users/users.js";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, Token, Encrypt],
  exports: [Token, Encrypt],
})
class AuthModule {}

export { AuthModule };
