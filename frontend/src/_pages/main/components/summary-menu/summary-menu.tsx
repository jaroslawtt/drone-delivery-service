"use client";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import {
  formContentAnimationVariants,
  EMPTY_MAP_LOCATION,
  ORDER_STATE_SEARCH_PARAM_KEY,
  OrderMenuState,
  SERVIVE_CARDS_DATA,
} from "../../libs/constants";
import { ChevronDown } from "lucide-react";
import { useAppForm } from "~/libs/hooks/hooks";
import { useOrderStore } from "~/stores/orders/orders";
import { useShallow } from "zustand/react/shallow";
import {
  orderApi,
  OrderCreateRequestDto,
  orderCreateValidationSchema,
} from "~/packages/orders/orders";
import { Button, Input } from "~/libs/components/components";
import { ServiveCard, ServiveSize } from "../servive-card/servive-card";
import { useMutation } from "@tanstack/react-query";
import { AppRoute } from "~/libs/enums/app-route.enum";
import { FindingNearbyDrone } from "../components";
import { motion } from "framer-motion";

const SummaryMenu: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { destination, entryPoint, weight, resetOrder } = useOrderStore(
    useShallow((state) => ({
      entryPoint: state.entryPoint,
      destination: state.destination,
      weight: state.weight,
      resetOrder: state.resetOrder,
    })),
  );

  const {
    mutate: createOrder,
    isPending: isCreateOrderLoading,
    isSuccess: isCreationSucceeded,
  } = useMutation({
    mutationFn: orderApi.createOrder.bind(orderApi),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      resetOrder();

      return void router.push(AppRoute.HOME);
    },
  });

  const { control, errors, handleSubmit, handleValuesGet } =
    useAppForm<OrderCreateRequestDto>({
      defaultValues: {
        entryPoint: entryPoint ?? EMPTY_MAP_LOCATION,
        destination: destination ?? EMPTY_MAP_LOCATION,
        weight: weight ?? "",
      },
      validationSchema: orderCreateValidationSchema,
      mode: "onChange",
    });

  const handleBackToLocationChange = () => {
    return void router.push("/");
  };
  const handleBackToServiveChange = () => {
    const searchParams = new URLSearchParams();
    searchParams.set(ORDER_STATE_SEARCH_PARAM_KEY, OrderMenuState.SERVIVE);

    return void router.push(`${pathname}?${searchParams.toString()}`);
  };

  useEffect(() => {
    if (!weight || !destination || !entryPoint) {
      router.push(pathname);
    }
  }, [weight, destination, entryPoint, router, pathname]);

  const handleOrderNow = () => {
    const entryPointFormValue = handleValuesGet("entryPoint");
    const destinationFormValue = handleValuesGet("destination");
    const weightFormValue = handleValuesGet("weight");

    return void createOrder({
      entryPoint: entryPointFormValue,
      destination: destinationFormValue,
      weight: weightFormValue,
    });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    return void handleSubmit(handleOrderNow, (err) => console.error(err))();
  };

  return (
    <motion.form
      {...formContentAnimationVariants}
      onSubmit={handleFormSubmit}
      className="w-full"
    >
      {isCreateOrderLoading || isCreationSucceeded ? (
        <FindingNearbyDrone />
      ) : (
        <div className="w-full flex flex-col gap-y-[20px]">
          <div className="flex flex-col gap-y-[20px]">
            <div
              onClick={handleBackToLocationChange}
              className="flex items-center gap-[4px]"
            >
              <span className="text-[14px] font-bold text-primary capitalize">
                Change Location
              </span>
              <ChevronDown className="w-[15.62px] h-[15.62px] text-primary" />
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
            <div
              onClick={handleBackToServiveChange}
              className="flex items-center gap-[4px]"
            >
              <span className="text-[14px] font-bold text-primary capitalize">
                Change Servive
              </span>
              <ChevronDown className="w-[15.62px] h-[15.62px] text-primary" />
            </div>
            {weight?.length &&
              SERVIVE_CARDS_DATA.filter(
                (card) => card.weightValue === weight,
              ).map((serviveCardData, index) => (
                <ServiveCard
                  key={`card-${index}`}
                  isBestDeal={serviveCardData.isBestDeal}
                  size={serviveCardData.size as ServiveSize}
                  weightValue={serviveCardData.weightValue}
                  priceValue={serviveCardData.priceValue}
                />
              ))}
          </div>
          <Button isDisabled={isCreateOrderLoading} label="Order Now" />
        </div>
      )}
    </motion.form>
  );
};

export { SummaryMenu };
