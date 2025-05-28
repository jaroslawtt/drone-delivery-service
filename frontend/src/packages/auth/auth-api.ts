import { ApiPath } from "~/libs/enums/enums";
import { HttpApi } from "~/libs/packages/api/http-api";
import { IHttp } from "~/libs/packages/http/libs/interfaces/http.interface";
import { AuthApiPath } from "./libs/enums/enums";
import {
  type AuthSignInRequestDto,
  type AuthSignUpRequestDto,
  type AuthSignInResponseDto,
  type AuthGetCurrentResponseDto,
  AuthGenerateAccessResponseDto,
} from "./libs/types/types";

type Constructor = {
  baseUrl: string;
  http: IHttp;
};

class AuthApi extends HttpApi {
  public constructor({ baseUrl, http }: Constructor) {
    super({ path: ApiPath.AUTH, baseUrl, http });
  }

  public async signIn(
    payload: AuthSignInRequestDto,
  ): Promise<AuthSignInResponseDto> {
    const response = await this.load(
      this.getFullEndpoint(AuthApiPath.SIGN_IN),
      {
        method: "POST",
        payload: JSON.stringify(payload),
      },
    );

    return (await response.json()).payload as AuthSignInResponseDto;
  }

  public async signUp(
    payload: AuthSignUpRequestDto,
  ): Promise<AuthSignInResponseDto> {
    const response = await this.load(
      this.getFullEndpoint(AuthApiPath.SIGN_UP),
      {
        method: "POST",
        payload: JSON.stringify(payload),
      },
    );

    return (await response.json()).payload as AuthSignInResponseDto;
  }

  public async getCurrentUser(): Promise<AuthGetCurrentResponseDto> {
    const response = await this.load(
      this.getFullEndpoint(AuthApiPath.CURRENT),
      {
        method: "GET",
        hasAuth: true,
      },
    );

    return (await response.json()).payload as AuthGetCurrentResponseDto;
  }

  public async generateAccessToken(): Promise<AuthGenerateAccessResponseDto> {
    const response = await this.load(
      this.getFullEndpoint(AuthApiPath.GENERATE_ACCESS),
      {
        method: "GET",
        hasAuth: false,
      },
    );

    return (await response.json()).payload as AuthGenerateAccessResponseDto;
  }
}

export { AuthApi };
