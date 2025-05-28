import { ValueOf } from "~/libs/types/types";

type DroneGetAllItemResonseDto = {
  id: number;
  serialNumber: string;
  status: ValueOf<{
    readonly OFFLINE: "offline";
    readonly ONLINE: "online";
  }>;
  batteryLevel: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export { type DroneGetAllItemResonseDto };
