"use client";
import { Banknote } from "lucide-react";
import { cn } from "~/libs/helpers/helpers";
import { type ValueOf } from "~/libs/types/types";
import { MapLocation } from "~/packages/map/libs/types/types";
import { OrderStatus } from "~/packages/orders/orders";
import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { geocoding } from "@maptiler/sdk";

type Properties = {
  date: string;
  entryPoint: MapLocation;
  destination: MapLocation;
  status: ValueOf<typeof OrderStatus>;
  amount: string;
};

const statusToCaption: Record<ValueOf<typeof OrderStatus>, string> = {
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.CANCELLED]: "Canceled",
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.CREATED]: "Created",
  [OrderStatus.IN_TRANSIT]: "In Transit",
};

const dateToFormatted = (date: string): string | null => {
  try {
    const dateObject = parseISO(date);

    return format(dateObject, "d MMM yyyy 'at' HH:mm");
  } catch {
    return null;
  }
};

const HistoryItemCard = ({
  date,
  destination,
  entryPoint,
  status,
  amount,
}: Properties) => {
  const { data: destinationAddress } = useQuery({
    queryKey: [
      "destinationAddress",
      destination.latitude,
      destination.longitude,
    ],
    queryFn: async () => {
      const response = await geocoding.reverse(
        [parseFloat(destination.longitude), parseFloat(destination.latitude)],
        {
          limit: 1,
        },
      );

      return response.features.map((feature) => ({
        name: feature.place_name,
      }));
    },
  });

  const { data: entryPointAddress } = useQuery({
    queryKey: ["entryPointAddress", entryPoint.latitude, entryPoint.longitude],
    queryFn: async () => {
      const response = await geocoding.reverse(
        [parseFloat(entryPoint.longitude), parseFloat(entryPoint.latitude)],
        {
          limit: 1,
        },
      );

      return response.features.map((feature) => ({
        name: feature.place_name,
      }));
    },
  });

  return (
    <div className="w-full bg-white rounded-lg p-4">
      <span>{dateToFormatted(date)}</span>
      <div className="flex flex-col gap-y-1 my-2 overflow-hidden">
        <span>{destinationAddress?.at(0)?.name}</span>
        <span>{entryPointAddress?.at(0)?.name}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-x-2 items-center">
          {amount} $
          <Banknote className="text-tertiary" />
        </div>
        <div
          className={cn(
            "py-1 px-2 text-white rounded-lg bg-green-400 uppercase",
            {
              "bg-red-400": status === OrderStatus.CANCELLED,
            },
          )}
        >
          {statusToCaption[status]}
        </div>
      </div>
    </div>
  );
};

export { HistoryItemCard };
