import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FastifyReply, FastifyRequest } from "fastify";
import ms, { type StringValue } from "ms";
import { AuthService } from "./auth.service.js";
import { AuthApiPath } from "./libs/enums/enums.js";
import {
  type AuthSignInResponseDto,
  type AuthSignInRequestDto,
  type AuthSignUpRequestDto,
  type AuthSignUpResponseDto,
  type AuthGetCurrentResponseDto,
  type AuthGenerateAccessResponseDto,
} from "./libs/types/types.js";
import {
  authSignInValidationSchema,
  authSignUpValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { ApiPath } from "~/libs/enums/enums.js";
import { PublicRoute } from "~/libs/packages/routes/public-route.decorator.js";
import { BodyValidationSchema } from "~/libs/packages/validation/body-validation-schema.decorator.js";
import { GetUser, type UserEntityPayload } from "~/packages/users/users.js";

@Controller(ApiPath.AUTH)
class AuthController {
  private readonly authService: AuthService;
  private readonly configService: ConfigService;

  public constructor(authService: AuthService, configService: ConfigService) {
    this.authService = authService;
    this.configService = configService;
  }

  @Post(AuthApiPath.SIGN_UP)
  @BodyValidationSchema(authSignUpValidationSchema)
  @PublicRoute()
  @HttpCode(HttpStatus.CREATED)
  public async signUp(
    @Body() authSignUpDto: AuthSignUpRequestDto,
    @Res() reply: FastifyReply,
  ): Promise<AuthSignUpResponseDto> {
    const { user, refreshToken, accessToken } =
      await this.authService.signUp(authSignUpDto);

    reply.setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: true,
      expires: new Date(
        Date.now() +
          ms(
            this.configService.get<string>(
              "REFRESH_TOKEN_EXPIRATION_TIME",
            ) as StringValue,
          ),
      ),
      path: "/",
    });

    return reply.send({
      payload: {
        user,
        accessToken,
      },
    });
  }

  @Post(AuthApiPath.SIGN_IN)
  @BodyValidationSchema(authSignInValidationSchema)
  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @Body() authSignInDto: AuthSignInRequestDto,
    @Res() reply: FastifyReply,
  ): Promise<AuthSignInResponseDto> {
    const { user, refreshToken, accessToken } =
      await this.authService.signIn(authSignInDto);

    reply.setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: true,
      expires: new Date(
        Date.now() +
          ms(
            this.configService.get<string>(
              "REFRESH_TOKEN_EXPIRATION_TIME",
            ) as StringValue,
          ),
      ),
      path: "/",
    });

    return reply.send({
      payload: {
        user,
        accessToken,
      },
    });
  }

  @Get(AuthApiPath.CURRENT)
  @HttpCode(HttpStatus.OK)
  public getCurrent(
    @GetUser() user: UserEntityPayload,
  ): AuthGetCurrentResponseDto {
    return {
      user,
    };
  }

  @Get(AuthApiPath.GENERATE_ACCESS)
  @PublicRoute()
  public async generateAccess(
    @Req() req: FastifyRequest,
  ): Promise<AuthGenerateAccessResponseDto> {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      throw new HttpException("Unathorized request", HttpStatus.UNAUTHORIZED);
    }

    const accessToken = await this.authService.generateAccess(refreshToken);

    return {
      accessToken,
    };
  }
}

export { AuthController };
