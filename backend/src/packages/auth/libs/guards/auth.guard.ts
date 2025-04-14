import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyRequest } from "fastify";
import { Token } from "~/libs/packages/token/token.package.js";
import {
  type AuthAccessToken,
  type AuthRefreshToken,
  type AuthToken,
} from "~/libs/types/types.js";
import { UserService } from "~/packages/users/user.service.js";

@Injectable()
class AuthGuard implements CanActivate {
  private readonly reflector: Reflector;
  private readonly token: Token;
  private readonly userSerivce: UserService;

  public constructor(
    reflector: Reflector,
    token: Token,
    userSerivce: UserService,
  ) {
    this.reflector = reflector;
    this.token = token;
    this.userSerivce = userSerivce;
  }

  public async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest() as FastifyRequest;
    const [, accessToken] = request.headers.authorization?.split(" ") ?? [];

    if (!accessToken) {
      throw new HttpException(
        "Authorization header should be in format: Bearer <token>",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const {
      userId,
      type,
      exp: sessionExpireTime,
    } = this.token.decode<AuthToken & (AuthRefreshToken | AuthAccessToken)>(
      accessToken,
    );

    const isAccessToken = type === "access";

    if (!isAccessToken) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }

    const isSessionExpired = this.token.isExpired(sessionExpireTime);

    if (isSessionExpired) {
      throw new HttpException("Session expired", HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userSerivce.find(userId);

    if (!user) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }

    request.user = user;

    return true;
  }
}

export { AuthGuard };
