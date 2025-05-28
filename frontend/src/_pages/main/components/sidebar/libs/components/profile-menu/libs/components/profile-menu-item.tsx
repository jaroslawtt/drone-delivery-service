"use client";

import { cn } from "~/libs/helpers/helpers";

type Properties = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
};

const ProfileMenuItem = ({ icon, label, onClick, className }: Properties) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-x-2 py-2 [&:not(:last-of-type)]:border-b border-gray-200",
        className,
      )}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export { ProfileMenuItem };
