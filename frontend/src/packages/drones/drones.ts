import { DronesApi } from "./drones-api";

import { http } from "~/libs/packages/http/http";

const dronesApi = new DronesApi({
  baseUrl: process.env["NEXT_PUBLIC_API_ORIGIN_URL"] as string,
  http: http,
});

export { dronesApi };
export {
  type DroneGetAllItemResonseDto,
  type DroneLocation,
  type DroneWithLocationGetAllItemResponseDto,
} from "./libs/types/types";
export { DroneStatus } from "./libs/enums/enums";
