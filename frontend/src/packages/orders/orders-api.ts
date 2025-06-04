import { ApiPath } from "~/libs/enums/enums";
import { HttpApi } from "~/libs/packages/api/http-api";
import { IHttp } from "~/libs/packages/http/libs/interfaces/interfaces";
import {
  type OrderGetAllResponseDto,
  type OrderCreateRequestDto,
  type OrderCreateResponseDto,
} from "./orders";
import { OrdersApiPath } from "./libs/enums/enums";
import { type OrderGetNumberOfOrdersProducedTodayResponse } from "./libs/types/types";

type Constructor = {
  baseUrl: string;
  http: IHttp;
};

class OrdersApi extends HttpApi {
  public constructor({ baseUrl, http }: Constructor) {
    super({ path: ApiPath.ORDERS, baseUrl, http });
  }

  public async getAllUserOrders(): Promise<OrderGetAllResponseDto> {
    const response = await this.load(
      this.getFullEndpoint(OrdersApiPath.ROOT, {}),
      {
        method: "GET",
        hasAuth: true,
      },
    );

    return (await response.json()).payload as OrderGetAllResponseDto;
  }

  public async createOrder(
    payload: OrderCreateRequestDto,
  ): Promise<OrderCreateResponseDto> {
    const response = await this.load(
      this.getFullEndpoint(OrdersApiPath.ROOT, {}),
      {
        method: "POST",
        payload: JSON.stringify(payload),
        hasAuth: true,
      },
    );

    return (await response.json()).payload as OrderCreateResponseDto;
  }

  public async numberOfProducedOrdersToday(): Promise<OrderGetNumberOfOrdersProducedTodayResponse> {
    const response = await this.load(
      this.getFullEndpoint(OrdersApiPath.PRODUCED_TODAY, {}),
      {
        method: "GET",
        hasAuth: true,
      },
    );

    return (await response.json())
      .payload as OrderGetNumberOfOrdersProducedTodayResponse;
  }
}

export { OrdersApi };
