import { type ValueOf } from "~/libs/types/types.js";
import { OrderStatus } from "../enums/enums.js";

type OrderCreateResponseDto = {
  id: number;
  clientId: number | null;
  amount: string;
  weight: string;
  status: ValueOf<typeof OrderStatus>;
  createdAt: string;
  updatedAt: string;
};

export { type OrderCreateResponseDto };
