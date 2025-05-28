import { ApiPath } from "~/libs/enums/enums";
import { HttpApi } from "~/libs/packages/api/http-api";
import { IHttp } from "~/libs/packages/http/libs/interfaces/http.interface";
import {
  UserUpdateRequestDto,
  UserUpdateResponseDto,
  type UserUpdatePasswordDto,
} from "./libs/types/types";
import { UserApiPath } from "./libs/enums/enums";

type Constructor = {
  baseUrl: string;
  http: IHttp;
};

class UserApi extends HttpApi {
  public constructor({ baseUrl, http }: Constructor) {
    super({ path: ApiPath.USERS, baseUrl, http });
  }

  public async updatePassword(payload: UserUpdatePasswordDto): Promise<void> {
    return void (await this.load(
      this.getFullEndpoint(UserApiPath.CHANGE_PASSWORD),
      {
        method: "POST",
        payload: JSON.stringify(payload),
        hasAuth: true,
      },
    ));
  }

  public async updateUser(
    payload: UserUpdateRequestDto,
  ): Promise<UserUpdateResponseDto> {
    const response = await this.load(this.getFullEndpoint(UserApiPath.ROOT), {
      method: "PUT",
      hasAuth: true,
      payload: JSON.stringify(payload),
    });

    return (await response.json()).payload as UserUpdateResponseDto;
  }

  public async deleteAccount(): Promise<void> {
    return void (await this.load(this.getFullEndpoint(UserApiPath.ROOT), {
      method: "DELETE",
      hasAuth: true,
      payload: JSON.stringify({}),
    }));
  }
}

export { UserApi };
