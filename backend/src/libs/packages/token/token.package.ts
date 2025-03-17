import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { decodeJwt, JWTPayload, SignJWT } from "jose";

@Injectable()
export class Token {
  private readonly configService: ConfigService;

  public constructor(configService: ConfigService) {
    this.configService = configService;
  }

  public async generate<T extends Record<string, unknown>>(
    payload: T,
    config?: {
      expiresIn: number | string | Date;
    },
  ): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({
        alg: this.configService.get<string>("AUTH_ALGORITHM") as string,
      })
      .setExpirationTime(config?.expiresIn ?? "1h")
      .sign(
        new TextEncoder().encode(
          this.configService.get<string>("JWT_SECRET_KEY"),
        ),
      );
  }

  public decode<T>(token: string): JWTPayload & T {
    return decodeJwt(token) as JWTPayload & T;
  }

  public isExpired(exp?: number): boolean {
    return Date.now() >= (exp ?? 0) * 1000;
  }
}
