import { type ValueOf } from "~/libs/types/types.js";
import { OrderStatus } from "../enums/enums.js";

type OrderCreateResponseDto = {
  id: number;
  clientId: number;
  amount: string;
  weight: string;
  status: ValueOf<typeof OrderStatus>;
  createdAt: Date;
  updatedAt: Date;
};

export { type OrderCreateResponseDto };
