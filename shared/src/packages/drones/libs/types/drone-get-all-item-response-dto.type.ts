import { ValueOf } from "~/libs/types/types";
import { DroneStatus } from "../enums/drone-status.enum.js";

type DroneGetAllItemResonseDto = {
  id: number;
  serialNumber: string;
  model: string;
  status: ValueOf<typeof DroneStatus>;
  batteryLevel: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export { type DroneGetAllItemResonseDto };
