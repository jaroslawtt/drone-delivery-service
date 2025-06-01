import { FC } from "react";
import { type ValueOf } from "~/libs/types/types";
import { type DroneGetAllItemResonseDto } from "~/packages/drones/libs/types/types";
import { DroneStatus } from "~/packages/drones/drones";
import { cn } from "~/libs/helpers/helpers";
import { EllipsisVertical } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "~/libs/ui/menubar";

type Properties = {
  droneData: DroneGetAllItemResonseDto;
};

const statusToCaption: Record<ValueOf<typeof DroneStatus>, string> = {
  [DroneStatus.ONLINE]: "Online",
  [DroneStatus.OFFLINE]: "Offline",
};

const DroneCard: FC<Properties> = ({
  droneData: { serialNumber, status, batteryLevel },
}) => {
  return (
    <div className="w-full rounded-lg border border-solid border-gray-300 p-3">
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex justify-between items-center">
          <h3 className="text-lg font-semibold">Drone: #{serialNumber}</h3>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <EllipsisVertical className="w-[18px] h-[18px]" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <span className="text-red-500">Delete</span>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <span
          className={cn("font-semibold text-[15px]", {
            "text-green-500": status === DroneStatus.ONLINE,
            "text-red-500": status === DroneStatus.OFFLINE,
          })}
        >
          {statusToCaption[status]}
        </span>
        <span className="mt-2 text-gray-500">Battery: {batteryLevel}%</span>
      </div>
    </div>
  );
};

export { DroneCard };
