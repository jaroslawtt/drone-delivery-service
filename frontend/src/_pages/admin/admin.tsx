"use client";
import { FC } from "react";
import { DroneParkList, PanelBadge } from "./libs/components/components";
import { Map } from "~/libs/components/components";
import { useQuery } from "@tanstack/react-query";
import { dronesApi, DroneStatus } from "~/packages/drones/drones";

const AdminPage: FC = () => {
  const { data: drones } = useQuery({
    queryKey: ["drones"],
    queryFn: dronesApi.findAll.bind(dronesApi),
    refetchInterval: 5000,
  });

  return (
    <main className="h-full max-h-screen overflow-hidden w-full">
      <div className="flex flex-col h-full p-6 gap-y-3">
        <div className="grid grid-cols-2 gap-x-3">
          <PanelBadge
            className="bg-green-100 text-green-600"
            label="Active Drones"
            value={
              drones?.items.filter(
                (drone) => drone.status === DroneStatus.ONLINE,
              ).length ?? 0
            }
          />
          <PanelBadge
            className="bg-purple-100 text-purple-600"
            label="Deliveries Today"
            value={100}
          />
        </div>
        <div className="h-[200px] shrink-0">
          <Map className="rounded-[24px]" />
        </div>
        <DroneParkList drones={drones?.items ?? []} />
      </div>
    </main>
  );
};

export { AdminPage };
