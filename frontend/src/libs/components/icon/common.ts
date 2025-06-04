import MenuBurger from "@assets/svg/menu-burger.svg";
import Drone from "@assets/svg/drone.svg";
import DroneWithBox from "@assets/svg/drone-with-box.svg";
import PickUpLocation from "@assets/svg/pickup-location.svg";
import DeliveringToLocation from "@assets/svg/delivering-to-location.svg";
import SmallBoxIcon from "@assets/svg/box-small-size.svg";
import MeduimBoxIcon from "@assets/svg/box-medium-size.svg";
import LargeBoxIcon from "@assets/svg/box-large-size.svg";
import PickupPointer from "@assets/svg/pointer.svg";
import DestinationPointer from "@assets/svg/delivery-pointer.svg";
import Telegram from "@assets/svg/telegram.svg";

const iconNameToSvgIcon = {
  "menu-burger": MenuBurger,
  drone: Drone,
  "drone-with-box": DroneWithBox,
  "pickup-location": PickUpLocation,
  "delivering-to-location": DeliveringToLocation,
  "small-box": SmallBoxIcon,
  "medium-box": MeduimBoxIcon,
  "large-box": LargeBoxIcon,
  "pickup-pointer": PickupPointer,
  "destination-pointer": DestinationPointer,
  telegram: Telegram,
} as const;

export { iconNameToSvgIcon };
