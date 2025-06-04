"use client";
import { FC, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAppForm } from "~/libs/hooks/hooks";
import { Input } from "~/libs/components/components";
import { ServiveCard } from "./components/components";
import { usePathname, useRouter } from "next/navigation";
import {
  formContentAnimationVariants,
  EMPTY_MAP_LOCATION,
  ORDER_STATE_SEARCH_PARAM_KEY,
  OrderMenuState,
  SERVIVE_CARDS_DATA,
} from "../../libs/constants";
import { type OrderCreateRequestDto } from "~/packages/orders/orders";
import { useOrderStore } from "~/stores/orders/order.store";
import { useShallow } from "zustand/react/shallow";
import { ServiveSize } from "../servive-card/servive-card";
import { motion } from "framer-motion";

const ServiveMenu: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { destination, entryPoint, setWeight } = useOrderStore(
    useShallow((state) => ({
      entryPoint: state.entryPoint,
      destination: state.destination,
      setWeight: state.setWeight,
    })),
  );

  const { control, errors, handleSetValue, handleSubmit } =
    useAppForm<OrderCreateRequestDto>({
      defaultValues: {
        entryPoint: entryPoint ?? EMPTY_MAP_LOCATION,
        destination: destination ?? EMPTY_MAP_LOCATION,
        weight: "",
      },
      mode: "onChange",
    });

  const handleBack = () => {
    return void router.push("/");
  };

  const handleMoveNext = () => {
    const searchParams = new URLSearchParams();
    searchParams.set(ORDER_STATE_SEARCH_PARAM_KEY, OrderMenuState.SUMMARY);

    return void router.push(`${pathname}?${searchParams.toString()}`);
  };

  const handleServiveCardClick = (size: string) => {
    handleSetValue("weight", size);

    setWeight(size);

    return void handleSubmit(handleMoveNext)();
  };

  useEffect(() => {
    if (!destination || !entryPoint) {
      router.push(pathname);
    }
  }, [destination, entryPoint, router, pathname]);

  return (
    <motion.div
      {...formContentAnimationVariants}
      className="w-full flex flex-col gap-y-[20px]"
    >
      <div className="flex flex-col gap-y-[20px]">
        <div onClick={handleBack} className="flex items-center gap-[4px]">
          <span className="text-[14px] font-bold text-primary capitalize">
            Change Location
          </span>
          <ChevronDown className="text-primary w-[15.62px] h-[15.62px]" />
        </div>
        <div className="w-full grid grid-cols-2 gap-x-[20px]">
          <Input
            type="location"
            label="Pickup Location"
            name="entryPoint"
            control={control}
            errors={errors}
            isDisabled={true}
          />
          <Input
            type="location"
            label="Delivering To"
            name="destination"
            control={control}
            errors={errors}
            isDisabled={true}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-[20px]">
        <h2>Choose servive</h2>
        {SERVIVE_CARDS_DATA.map((serviveCardData, index) => (
          <ServiveCard
            key={`card-${index}`}
            isBestDeal={serviveCardData.isBestDeal}
            size={serviveCardData.size as ServiveSize}
            weightValue={serviveCardData.weightValue}
            priceValue={serviveCardData.priceValue}
            onClick={() => handleServiveCardClick(serviveCardData.weightValue)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export { ServiveMenu };
