import { FC } from "react";

type Properties = {
  label: string;
};

const AboutServiceMenuItem: FC<Properties> = ({ label }: Properties) => {
  return (
    <div className="w-full flex items-center bg-white p-4 [&:not(:last-of-type)]:border-b border-gray-200">
      <p className="text-black font-semibold">{label}</p>
    </div>
  );
};

export { AboutServiceMenuItem };
