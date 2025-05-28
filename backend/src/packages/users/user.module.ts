import { Module } from "@nestjs/common";
import { UserController } from "./user.controller.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";
import { Encrypt } from "~/libs/packages/encrypt/encrypt.js";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserRepository, UserService, Encrypt],
  exports: [UserService],
})
class UserModule {}

export { UserModule };
