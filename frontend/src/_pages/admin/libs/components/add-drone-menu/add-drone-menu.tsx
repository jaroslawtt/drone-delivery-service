"use client";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { Button, Dialog, Icon, Input } from "~/libs/components/components";
import { useAppForm } from "~/libs/hooks/hooks";
import { dronesApi } from "~/packages/drones/drones";
import { DroneCreateRequestDto } from "~/packages/drones/libs/types/types";
import { droneCreateItemValidationSchema } from "~/packages/drones/libs/validation-schemas/validation-schemas";
import { useNotifyStore } from "~/stores/notify/notify.store";

const AddDroneMenu: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setNotify = useNotifyStore((state) => state.setNotify);

  const { control, errors, handleSubmit } = useAppForm<DroneCreateRequestDto>({
    defaultValues: {
      model: "",
      serialNumber: "",
    },
    validationSchema: droneCreateItemValidationSchema,
  });
  const { mutate: createDrone } = useMutation({
    mutationFn: dronesApi.create.bind(dronesApi),
    onSuccess: () => {
      setIsOpen(false);

      return void setNotify({
        message: "Drone successfully added",
        status: "success",
        title: "Drone added",
      });
    },
  });

  return (
    <>
      <Button
        className="self-end w-auto px-5 py-2 font-semibold"
        label="+ Add Drone"
        onClick={() => setIsOpen(true)}
      />
      <Dialog
        className="z-50"
        isOpen={isOpen}
        onCloseClick={() => setIsOpen(false)}
      >
        <form
          onSubmit={handleSubmit((payload) => createDrone(payload))}
          className="h-full flex flex-col justify-between"
        >
          <div className="flex flex-col gap-y-3">
            <h2>Add Drone</h2>
            <div className="flex flex-col gap-y-3">
              <Icon
                iconName="drone-with-box"
                className="w-[207px] h-[188px] mx-auto mt-4"
              />
              <div className="flex flex-col">
                <Input
                  control={control}
                  errors={errors}
                  name="model"
                  label="Model"
                />
                <Input
                  control={control}
                  errors={errors}
                  name="serialNumber"
                  label="Serial Number"
                />
              </div>
            </div>
          </div>
          <Button className="self-end" label="Submit" />
        </form>
      </Dialog>
    </>
  );
};

export { AddDroneMenu };
