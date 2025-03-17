import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  type AuthSignInRequestDto,
  type AuthSignUpRequestDto,
} from "./libs/types/types.js";
import { Encrypt } from "~/libs/packages/encrypt/encrypt.js";
import { Token } from "~/libs/packages/token/token.js";
import {
  type AuthRefreshToken,
  type AuthAccessToken,
} from "~/libs/types/types.js";
import { UserPrivateDataPayload, UserService } from "~/packages/users/users.js";

@Injectable()
class AuthService {
  private readonly userService: UserService;
  private readonly configService: ConfigService;
  private readonly encrypt: Encrypt;
  private readonly token: Token;

  public constructor(
    userService: UserService,
    configService: ConfigService,
    encrypt: Encrypt,
    token: Token,
  ) {
    this.userService = userService;
    this.configService = configService;
    this.encrypt = encrypt;
    this.token = token;
  }

  public async signUp(payload: AuthSignUpRequestDto) {
    const { email, firstName, lastName, password } = payload;

    const userExists = Boolean(await this.userService.findByEmail(email));

    if (userExists) {
      throw new HttpException("User already exists", HttpStatus.CONFLICT);
    }

    const passwordSalt = await this.encrypt.generateSalt(
      this.configService.get<number>("USER_PASSWORD_SALT_ROUNDS") as number,
    );
    const passwordHash = await this.encrypt.encrypt(password, passwordSalt);

    const user = await this.userService.create({
      email,
      firstName,
      lastName,
      passwordHash,
      passwordSalt,
    });

    const refreshToken = await this.generateRefreshToken(user.id);
    const accessToken = await this.generateAccessToken(user.id);

    return {
      user,
      refreshToken,
      accessToken,
    };
  }

  public async signIn(payload: AuthSignInRequestDto) {
    const { email, password } = payload;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException(
        "User associated with this email does not exist",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userPrivateData = (await this.userService.getUserPrivateData(
      user.id,
    )) as UserPrivateDataPayload;

    const isPasswordValid = await this.encrypt.compare({
      data: password,
      passwordHash: userPrivateData.passwordHash,
      salt: userPrivateData.passwordSalt,
    });

    if (!isPasswordValid) {
      throw new HttpException(
        "Provided password is not correct",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const refreshToken = await this.generateRefreshToken(user.id);
    const accessToken = await this.generateAccessToken(user.id);

    return {
      user,
      refreshToken,
      accessToken,
    };
  }

  private generateAccessToken(userId: AuthAccessToken["userId"]) {
    return this.token.generate<AuthAccessToken>(
      {
        userId,
        type: "access",
      },
      {
        expiresIn: this.configService.get<string>(
          "ACCESS_TOKEN_EXPIRATION_TIME",
        ) as string,
      },
    );
  }

  private generateRefreshToken(userId: AuthRefreshToken["userId"]) {
    return this.token.generate<AuthRefreshToken>(
      {
        userId,
        type: "refresh",
      },
      {
        expiresIn: this.configService.get<string>(
          "REFRESH_TOKEN_EXPIRATION_TIME",
        ) as string,
      },
    );
  }

  public async generateAccess(refreshToken: string) {
    const { userId, exp: sessionExpireTime } =
      this.token.decode<AuthRefreshToken>(refreshToken);
    const isSessionExpired = this.token.isExpired(sessionExpireTime);

    if (isSessionExpired) {
      throw new HttpException("Session expired", HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.find(userId);

    if (!user) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }

    const accessToken = await this.generateAccessToken(user.id);

    return accessToken;
  }
}

export { AuthService };
