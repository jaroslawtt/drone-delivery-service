"use client";
import { Check } from "lucide-react";
import { FC } from "react";

type Properties = {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
};

const PaymentMethod: FC<Properties> = ({
  label,
  icon,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className="w-full flex items-center bg-white p-4 gap-x-2 justify-between [&:not(:last-of-type)]:border-b border-gray-200"
      onClick={onClick}
    >
      <div className="flex items-center gap-x-2">
        {icon}
        <span>{label}</span>
      </div>
      {isSelected && <Check className="text-tertiary" />}
    </div>
  );
};

export { PaymentMethod };
