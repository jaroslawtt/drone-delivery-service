"use client";
import { FC } from "react";
import { cnMerge } from "~/libs/helpers/cn-merge";

type Properties = {
  label: string;
  className?: string;
  onClick?: () => void;
  isDisabled?: boolean;
};

const Button: FC<Properties> = ({
  label,
  className,
  onClick,
  isDisabled = false,
}: Properties) => {
  return (
    <button
      onClick={onClick}
      className={cnMerge(
        "bg-primary text-white w-full text-center text-[14px] py-[10px] rounded-[10px] font-bold",
        {
          "opacity-70": isDisabled,
        },
        className,
      )}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};

export { Button };
