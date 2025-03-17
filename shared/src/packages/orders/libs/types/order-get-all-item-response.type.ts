import { type ValueOf } from "~/libs/types/value-of.type";
import { OrderStatus } from "../enums/order-status.enum";

type OrderGetAllItemResponseDto = {
  id: number;
  clientId: number;
  amount: string;
  weight: string;
  status: ValueOf<typeof OrderStatus>;
  createdAt: Date;
  updatedAt: Date;
};

export { type OrderGetAllItemResponseDto };
