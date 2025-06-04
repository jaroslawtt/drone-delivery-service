"use client";
import { useSearchParams } from "next/navigation";
import {
  orderStateToMenu,
  ORDER_STATE_SEARCH_PARAM_KEY,
} from "./libs/constants";
import { Menu } from "~/libs/components/components";
import { useMapStore } from "~/stores/map/map";
import { useEffect } from "react";
import { SendPackageMenu } from "./components/components";
import { Sidebar } from "./components/sidebar/sidebar";

const MainPage = () => {
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

  return (
    <main>
      <Sidebar />
      <Menu initialHeight={40}>{renderMenuContent(orderState)}</Menu>
    </main>
  );
};

export { MainPage };
