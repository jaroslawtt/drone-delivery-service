import { type DroneGetAllItemResonseDto } from "~/packages/drones/drones";
import { MapLocation } from "./map-location.type";

type MapGetAllItemReponseDto = {
  destination: MapLocation;
  location: MapLocation;
  isDelivering: boolean;
} & Pick<DroneGetAllItemResonseDto, "id">;

export { type MapGetAllItemReponseDto };
