import { FC } from "react";
import { cn } from "~/libs/helpers/helpers";

type Properties = {
  label: string;
  value: number;
  className?: string;
};

const PanelBadge: FC<Properties> = ({
  label,
  value,
  className,
}: Properties) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-2 p-3 rounded-md min-w-[120px]",
        className,
      )}
    >
      <span className="text-md font-medium">{label}</span>
      <span className="text-2xl font-bold text-black">{value}</span>
    </div>
  );
};

export { PanelBadge };
