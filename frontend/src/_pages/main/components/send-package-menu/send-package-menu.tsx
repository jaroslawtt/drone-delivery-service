"use client";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, FC, useEffect } from "react";
import { Button, Icon, Input } from "~/libs/components/components";
import {
  formContentAnimationVariants,
  EMPTY_MAP_LOCATION,
  ORDER_STATE_SEARCH_PARAM_KEY,
  OrderMenuState,
} from "../../libs/constants";
import { usePathname } from "next/navigation";
import { useAppForm } from "~/libs/hooks/hooks";
import {
  orderCreateValidationSchema,
  type OrderCreateRequestDto,
} from "~/packages/orders/orders";
import { useOrderStore } from "~/stores/orders/orders";
import { useShallow } from "zustand/react/shallow";
import { deepEqual } from "~/libs/helpers/helpers";
import { motion } from "framer-motion";

const locationOnlyValidationSchema = orderCreateValidationSchema.pick({
  entryPoint: true,
  destination: true,
});

const SendPackageMenu: FC = () => {
  const { destination, entryPoint, setDestination, setEntryPoint } =
    useOrderStore(
      useShallow((state) => ({
        destination: state.destination,
        entryPoint: state.entryPoint,
        setDestination: state.setDestination,
        setEntryPoint: state.setEntryPoint,
      })),
    );

  const router = useRouter();
  const pathname = usePathname();

  const controls = useAppForm<OrderCreateRequestDto>({
    defaultValues: {
      entryPoint: entryPoint ?? EMPTY_MAP_LOCATION,
      destination: destination ?? EMPTY_MAP_LOCATION,
    },
    validationSchema: locationOnlyValidationSchema,
    mode: "onChange",
  });

  const {
    control,
    errors,
    handleSubmit,
    handleSetValue,
    handleValuesGet,
    handleWatch,
  } = controls;

  const formEntryPoint = handleWatch("entryPoint");
  const formDestination = handleWatch("destination");

  const handleContinue = () => {
    const searchParams = new URLSearchParams();
    searchParams.set(ORDER_STATE_SEARCH_PARAM_KEY, OrderMenuState.SERVIVE);

    return void router.push(`${pathname}?${searchParams.toString()}`);
  };
  const handleFormSubmit = (event_: BaseSyntheticEvent): void =>
    void handleSubmit(handleContinue, (err) => console.log(err))(event_);

  useEffect(() => {
    if (!deepEqual(handleValuesGet("entryPoint"), entryPoint)) {
      handleSetValue("entryPoint", entryPoint ?? EMPTY_MAP_LOCATION);
    }
    if (!deepEqual(handleValuesGet("destination"), destination)) {
      handleSetValue("destination", destination ?? EMPTY_MAP_LOCATION);
    }
  }, [destination, entryPoint, handleValuesGet, handleSetValue]);

  useEffect(() => {
    setEntryPoint((entryPoint) => {
      const shouldUpdateEntryPoint = !(
        deepEqual(formEntryPoint, entryPoint) ||
        (deepEqual(formEntryPoint, EMPTY_MAP_LOCATION) && entryPoint === null)
      );

      if (shouldUpdateEntryPoint) {
        if (formEntryPoint.latitude.length && formEntryPoint.longitude.length) {
          return {
            latitude: formEntryPoint.latitude,
            longitude: formEntryPoint.longitude,
          };
        } else {
          return null;
        }
      }

      return entryPoint;
    });

    return void setDestination((destination) => {
      const shouldUpdateDestination = !(
        deepEqual(formDestination, destination) ||
        (deepEqual(formDestination, EMPTY_MAP_LOCATION) && destination === null)
      );

      if (shouldUpdateDestination) {
        if (
          formDestination.latitude.length &&
          formDestination.longitude.length
        ) {
          return {
            latitude: formDestination.latitude,
            longitude: formDestination.longitude,
          };
        } else {
          return null;
        }
      }

      return destination;
    });
  }, [formEntryPoint, formDestination, setEntryPoint, setDestination]);

  return (
    <motion.form
      {...formContentAnimationVariants}
      onSubmit={handleFormSubmit}
      className="w-full"
    >
      <div className="w-full grid gap-y-[20px]">
        <h2>Send Package</h2>
        <div className="flex items-center gap-[13px]">
          <Icon iconName="pickup-location" className="w-[47px] h-[48px]" />
          <Input
            type="location"
            name="entryPoint"
            control={control}
            errors={errors}
            label="Pickup Location"
          />
        </div>
        <div className="flex items-center gap-[13px]">
          <Icon
            iconName="delivering-to-location"
            className="w-[47px] h-[48px]"
          />
          <Input
            type="location"
            name="destination"
            control={control}
            errors={errors}
            label="Delivering To"
          />
        </div>
        <Button isDisabled={!destination || !entryPoint} label="Continue" />
      </div>
    </motion.form>
  );
};

export { SendPackageMenu };
