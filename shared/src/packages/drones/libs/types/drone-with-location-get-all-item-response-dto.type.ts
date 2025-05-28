import { type DroneGetAllItemResonseDto } from "./drone-get-all-item-response-dto.type";
import { type DroneLocation } from "./drone-location.type.js";

type DroneWithLocationGetAllItemResponseDto = Pick<
  DroneGetAllItemResonseDto,
  "id"
> &
  DroneLocation;

export { type DroneWithLocationGetAllItemResponseDto };
