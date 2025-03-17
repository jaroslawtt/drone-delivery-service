import { Body, Controller, HttpCode, HttpStatus, Put } from "@nestjs/common";
import { GetUser } from "./libs/decorators/decorators.js";
import {
  type UserEntityPayload,
  type UserGetAllItemReponseDto,
  type UserUpdateRequestDto,
} from "./libs/types/types.js";
import { userUpdateValidationSchema } from "./libs/validation-schemas/validation-schemas.js";
import { UserService } from "./user.service.js";
import { BodyValidationSchema } from "~/libs/packages/validation/validation.js";

@Controller("/users")
class UserController {
  private readonly userService: UserService;

  public constructor(userService: UserService) {
    this.userService = userService;
  }

  @Put()
  @BodyValidationSchema(userUpdateValidationSchema)
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @Body() userUpdateDto: UserUpdateRequestDto,
    @GetUser() user: UserEntityPayload,
  ): Promise<UserGetAllItemReponseDto> {
    return this.userService.update(user.id, userUpdateDto);
  }
}

export { UserController };
