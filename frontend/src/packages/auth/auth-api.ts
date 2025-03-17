import { ApiPath } from "~/libs/enums/enums";
import { HttpApi } from "~/libs/packages/api/http-api";
import { IHttp } from "~/libs/packages/http/libs/interfaces/http.interface";
import { AuthApiPath } from "./libs/enums/enums";

type Constructor = {
  baseUrl: string;
  http: IHttp;
};

class AuthApi extends HttpApi {
  public constructor({ baseUrl, http }: Constructor) {
    super({ path: ApiPath.AUTH, baseUrl, http });
  }

  public async signIn(payload: unknown): Promise<unknown> {
    const response = await this.load(
      this.getFullEndpoint(AuthApiPath.SIGN_IN),
      {
        method: "POST",
        payload: JSON.stringify(payload),
      },
    );
  }
}

export { AuthApi };
