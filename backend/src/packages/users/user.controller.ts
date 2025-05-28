import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from "@nestjs/common";
import { GetUser } from "./libs/decorators/decorators.js";
import {
  UserUpdatePasswordDto,
  UserUpdateResponseDto,
  type UserEntityPayload,
  type UserUpdateRequestDto,
} from "./libs/types/types.js";
import {
  userUpdatePasswordValidationSchema,
  userUpdateValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { UserService } from "./user.service.js";
import { BodyValidationSchema } from "~/libs/packages/validation/validation.js";
import { UserApiPath } from "./libs/enums/enums.js";
import { ApiPath } from "~/libs/enums/enums.js";

@Controller(ApiPath.USERS)
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
  ): Promise<UserUpdateResponseDto> {
    return this.userService.update(user.id, userUpdateDto);
  }

  @Post(UserApiPath.CHANGE_PASSWORD)
  @BodyValidationSchema(userUpdatePasswordValidationSchema)
  @HttpCode(HttpStatus.OK)
  public async changePassword(
    @Body() userUpdatePasswordDto: UserUpdatePasswordDto,
    @GetUser() user: UserEntityPayload,
  ): Promise<void> {
    return void (await this.userService.changePassword(
      user.id,
      userUpdatePasswordDto,
    ));
  }

  @Delete(UserApiPath.ROOT)
  @HttpCode(HttpStatus.OK)
  public async deleteAccount(
    @GetUser() user: UserEntityPayload,
  ): Promise<void> {
    return void (await this.userService.delete(user.id));
  }
}

export { UserController };
