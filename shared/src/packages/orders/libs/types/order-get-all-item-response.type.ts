import { type ValueOf } from "~/libs/types/value-of.type";
import { OrderStatus } from "../enums/order-status.enum";
import { type MapLocation } from "~/packages/map/map";

type OrderGetAllItemResponseDto = {
  id: number;
  clientId: number | null;
  amount: string;
  weight: string;
  status: ValueOf<typeof OrderStatus>;
  destination: MapLocation;
  entryPoint: MapLocation;
  createdAt: string;
  updatedAt: string;
};

export { type OrderGetAllItemResponseDto };
