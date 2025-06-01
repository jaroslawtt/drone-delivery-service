import { DroneGetAllResponseDto } from "shared/build/packages/drones/libs/types/types";
import { ApiPath } from "~/libs/enums/enums";
import { HttpApi } from "~/libs/packages/api/http-api";
import { IHttp } from "~/libs/packages/http/libs/interfaces/interfaces";

type Constructor = {
  baseUrl: string;
  http: IHttp;
};

class DronesApi extends HttpApi {
  public constructor({ baseUrl, http }: Constructor) {
    super({ path: ApiPath.DRONES, baseUrl, http });
  }

  public async findAll(): Promise<DroneGetAllResponseDto> {
    const response = await this.load(this.getFullEndpoint(""), {
      method: "GET",
      hasAuth: true,
    });

    return (await response.json()).payload as DroneGetAllResponseDto;
  }
}

export { DronesApi };
