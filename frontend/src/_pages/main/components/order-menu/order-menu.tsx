"use client";
import { useSearchParams } from "next/navigation";
import {
  ORDER_STATE_SEARCH_PARAM_KEY,
  OrderMenuState,
} from "../../libs/constants";
import { useMapStore } from "~/stores/map/map";
import { useEffect } from "react";
import { SendPackageMenu, SummaryMenu, ServiveMenu } from "../components";
import { Menu } from "~/libs/components/components";

const orderStateToMenu = {
  [OrderMenuState.SUMMARY]: <SummaryMenu />,
  [OrderMenuState.SERVIVE]: <ServiveMenu />,
} as const;

const OrderMenu = () => {
  const searchParams = useSearchParams();
  const orderState = searchParams.get(
    ORDER_STATE_SEARCH_PARAM_KEY,
  ) as keyof typeof orderStateToMenu;

  const setCanSetRoute = useMapStore((state) => state.setCanSetRoute);

  const renderMenuContent = (state: keyof typeof orderStateToMenu) =>
    orderStateToMenu[state] ?? <SendPackageMenu />;

  useEffect(() => {
    setCanSetRoute(!orderState);
  }, [orderState, setCanSetRoute]);

  return <Menu initialHeight={40}>{renderMenuContent(orderState)}</Menu>;
};

export { OrderMenu };
