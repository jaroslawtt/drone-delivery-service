import { FC } from "react";
import { iconNameToSvgIcon } from "./common";

type Properties = {
  iconName: keyof typeof iconNameToSvgIcon;
  className?: string;
};

const Icon: FC<Properties> = ({ iconName, className }) => {
  const SvgIcon = iconNameToSvgIcon[iconName];

  return <SvgIcon className={className} />;
};

export { Icon };
