import { FC } from "react";
import { Icon, Loader } from "~/libs/components/components";

const FindingNearbyDrone: FC = () => {
  return (
    <div className="py-8 h-full w-full flex flex-col justify-center items-center gap-y-[20px]">
      <Icon iconName="drone-with-box" className="w-[207px] h-[188px]" />
      <h3 className="text-tertiary">Finding nearby available drone</h3>
      <Loader />
    </div>
  );
};

export { FindingNearbyDrone };
