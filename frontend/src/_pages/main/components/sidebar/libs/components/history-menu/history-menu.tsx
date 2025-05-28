"use client";
import { Check, Package, PackageCheck, X } from "lucide-react";
import { useState } from "react";
import { Dialog } from "~/libs/components/components";
import { HistoryItemCard } from "../components";
import { orderApi, OrderStatus } from "~/packages/orders/orders";
import { useQuery } from "@tanstack/react-query";

const HistoryMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAllUserOrders.bind(orderApi),
    enabled: isOpen,
    refetchInterval: 1000,
  });

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex gap-x-4 items-center"
      >
        <Package className="text-tertiary" />
        <span>Deliveries</span>
      </div>
      <Dialog
        className="z-[120] bg-gray-100"
        isOpen={isOpen}
        onCloseClick={() => setIsOpen((state) => !state)}
      >
        <div className="flex flex-col w-full h-full py-4 gap-y-4">
          <div className="flex flex-shrink-0 gap-x-3 w-full overflow-x-scroll no-scrollbar">
            <div className="bg-white flex flex-col shrink-0 gap-y-2 rounded-lg w-[150px] px-4 py-2">
              <div className="flex justify-between items-center">
                <span>Total deliveries</span>
                <PackageCheck className="text-tertiary" />
              </div>
              <span className="text-2xl font-bold">{orders?.items.length}</span>
            </div>
            <div className="bg-white flex flex-col shrink-0 gap-y-2 rounded-lg w-[150px] px-4 py-2">
              <div className="flex justify-between items-center">
                <span>Completed</span>
                <Check className="text-green-500" />
              </div>
              <span className="text-2xl font-bold">
                {orders?.items.reduce(
                  (acc, order) =>
                    acc + (order.status === OrderStatus.DELIVERED ? 1 : 0),
                  0,
                )}
              </span>
            </div>
            <div className="bg-white flex flex-col shrink-0 gap-y-2 rounded-lg w-[150px] px-4 py-2">
              <div className="flex justify-between items-center">
                <span>Canceled</span>
                <X className="text-red-500" />
              </div>
              <span className="text-2xl font-bold">
                {orders?.items.reduce(
                  (acc, order) =>
                    acc + (order.status === OrderStatus.CANCELLED ? 1 : 0),
                  0,
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-y-4 overflow-y-scroll no-scrollbar">
            {orders?.items?.map((order) => (
              <HistoryItemCard
                key={`order-${order.id}`}
                status={order.status}
                date={order.createdAt.toString()}
                entryPoint={order.entryPoint}
                destination={order.destination}
                amount={order.amount}
              />
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export { HistoryMenu };
