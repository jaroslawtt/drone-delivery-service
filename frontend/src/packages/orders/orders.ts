import { http } from "~/libs/packages/http/http";
import { OrdersApi } from "./orders-api";

const orderApi = new OrdersApi({
  baseUrl: process.env["NEXT_PUBLIC_API_ORIGIN_URL"] as string,
  http,
});

export {
  type OrderCreateRequestDto,
  type OrderCreateResponseDto,
  type OrderGetAllResponseDto,
  type OrderGetAllItemResponseDto,
} from "./libs/types/types";
export { OrderStatus } from "./libs/enums/enums";
export { orderCreateValidationSchema } from "./libs/validation-schemas/validation-schemas";

export { orderApi };
