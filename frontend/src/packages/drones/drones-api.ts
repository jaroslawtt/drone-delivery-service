import { ApiPath } from "~/libs/enums/enums";
import { HttpApi } from "~/libs/packages/api/http-api";
import { IHttp } from "~/libs/packages/http/libs/interfaces/interfaces";
import {
  type DroneCreateRequestDto,
  type DroneGetAllResponseDto,
  type DroneCreateResponseDto,
  type DroneUpdateItemResponseDto,
  type DroneUpdateItemRequestDto,
  DroneGetAllItemResonseDto,
} from "./libs/types/types";
import { DroneApiPath } from "./libs/enums/enums";
import { configureString } from "~/libs/helpers/configure-string.helper";

type Constructor = {
  baseUrl: string;
  http: IHttp;
};

class DronesApi extends HttpApi {
  public constructor({ baseUrl, http }: Constructor) {
    super({ path: ApiPath.DRONES, baseUrl, http });
  }

  public async findAll(): Promise<DroneGetAllResponseDto> {
    const response = await this.load(this.getFullEndpoint("", {}), {
      method: "GET",
      hasAuth: true,
    });

    return (await response.json()).payload as DroneGetAllResponseDto;
  }

  public async create(
    payload: DroneCreateRequestDto,
  ): Promise<DroneCreateResponseDto> {
    const response = await this.load(this.getFullEndpoint("", {}), {
      method: "POST",
      hasAuth: true,
      payload: JSON.stringify(payload),
    });

    return (await response.json()).payload as DroneCreateResponseDto;
  }

  public async update(
    droneId: DroneGetAllItemResonseDto["id"],
    payload: DroneUpdateItemRequestDto,
  ): Promise<DroneUpdateItemResponseDto> {
    const response = await this.load(
      this.getFullEndpoint(
        configureString(`/${DroneApiPath.$DRONE_ID}`, {
          droneId,
        }),
        {},
      ),
      {
        method: "PUT",
        hasAuth: true,
        payload: JSON.stringify(payload),
      },
    );

    return (await response.json()).payload as DroneUpdateItemResponseDto;
  }
}

export { DronesApi };
