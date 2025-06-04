import { type MapLocation } from "~/packages/map/libs/types/types";
// import { SummaryMenu, ServiveMenu } from "../components/components";

const ORDER_STATE_SEARCH_PARAM_KEY = "orderState" as const;

const OrderMenuState = {
  SUMMARY: "summary",
  SERVIVE: "servive",
} as const;

// const orderStateToMenu = {
// [OrderMenuState.SUMMARY]: <SummaryMenu />,
// [OrderMenuState.SERVIVE]: <ServiveMenu />,
// } as const;

const EMPTY_MAP_LOCATION: MapLocation = {
  latitude: "",
  longitude: "",
} as const;

const SERVIVE_CARDS_DATA = [
  {
    size: "small",
    weightValue: "1",
    priceValue: "$5",
    isBestDeal: true,
  },
  {
    size: "medium",
    weightValue: "3",
    priceValue: "$10",
    isBestDeal: false,
  },
  {
    size: "large",
    weightValue: "5",
    priceValue: "$15",
    isBestDeal: false,
  },
] as const;

const formContentAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1.5 },
} as const;

export {
  // orderStateToMenu,
  ORDER_STATE_SEARCH_PARAM_KEY,
  OrderMenuState,
  EMPTY_MAP_LOCATION,
  SERVIVE_CARDS_DATA,
  formContentAnimationVariants,
};
