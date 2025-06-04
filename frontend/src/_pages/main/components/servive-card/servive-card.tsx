"use client";
import { FC, JSX } from "react";
import { Icon } from "~/libs/components/components";
import { cnMerge } from "~/libs/helpers/cn-merge";

type ServiveSize = "small" | "medium" | "large";

type Properties = {
  className?: string;
  size?: ServiveSize;
  onClick?: () => void;
  isBestDeal?: boolean;
  weightValue?: string;
  priceValue?: string;
};

const sizeToIconMap: Record<ServiveSize, JSX.Element> = {
  medium: <Icon className="w-[32px] h-[32px]" iconName="medium-box" />,
  small: <Icon className="w-[32px] h-[32px]" iconName="small-box" />,
  large: <Icon className="w-[32px] h-[32px]" iconName="large-box" />,
};

const sizeToCaption: Record<ServiveSize, string> = {
  medium: "Medium Size",
  small: "Small Size",
  large: "Large Size",
};

const ServiveCard: FC<Properties> = ({
  className,
  size = "small",
  isBestDeal = false,
  weightValue = "1-2 Kg",
  priceValue = "$5",
  onClick,
}: Properties) => {
  return (
    <div
      onClick={onClick}
      className={cnMerge(
        "py-[4px] px-3 flex items-center justify-between w-full border-[1px] border-[#E9E9E9] rounded-[7px]",
        className,
      )}
    >
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-x-[10px]">
          {sizeToIconMap[size]}
          <div className="flex flex-col h-full justify-between">
            <span>{sizeToCaption[size]}</span>
            <span className="font-bold leading-[24.4px]">{weightValue}</span>
          </div>
        </div>
        <div className="flex flex-col h-full justify-between">
          {isBestDeal && <span>Best Deal 🔥</span>}
          <span className="font-bold leading-[24.4px] text-end">
            {priceValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export { ServiveCard, type ServiveSize };
