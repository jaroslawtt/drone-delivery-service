"use client";
import { useMutation } from "@tanstack/react-query";
import { ProfileMenuItem } from "../profile-menu-item";
import { RotateCcwKey } from "lucide-react";
import { Button, Dialog, Input } from "~/libs/components/components";
import { useAppForm, useMenuOpen } from "~/libs/hooks/hooks";
import { type UserUpdatePasswordDto } from "~/packages/users/libs/types/types";
import { userUpdatePasswordValidationSchema } from "~/packages/users/validation-schemas/validation-schemas";
import { userApi } from "~/packages/users/users";
import { type FieldErrors } from "react-hook-form";
import { useNotifyStore } from "~/stores/notify/notify";

const ChangePasswordMenu = () => {
  const { isOpen, toggleMenu } = useMenuOpen();
  const setNotify = useNotifyStore((state) => state.setNotify);

  const { control, errors, handleSubmit, handleReset } =
    useAppForm<UserUpdatePasswordDto>({
      validationSchema: userUpdatePasswordValidationSchema,
      defaultValues: {
        password: "",
        repeatPassword: "",
      },
      mode: "onSubmit",
    });

  const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation(
    {
      mutationFn: userApi.updatePassword.bind(userApi),
      onSuccess: () => {
        setNotify({
          status: "success",
          title: "Password updated",
          message: "Your password has been updated successfully",
        });
        toggleMenu();

        return void handleReset();
      },
      onError: () => {
        return void setNotify({
          status: "error",
          title: "Password update failed",
          message: "Please try again",
        });
      },
    },
  );

  const handleValidSubmit = (data: UserUpdatePasswordDto) => {
    updatePassword(data);
  };

  const handleInvalidSubmit = (
    validationErrors: FieldErrors<UserUpdatePasswordDto>,
  ) => {
    console.log("Form validation errors:", validationErrors);
  };

  return (
    <>
      <ProfileMenuItem
        label="Change password"
        icon={<RotateCcwKey className="text-tertiary" />}
        onClick={toggleMenu}
      />
      <Dialog
        className="z-[140] bg-gray-100"
        isOpen={isOpen}
        onCloseClick={() => {
          toggleMenu();
          handleReset();
        }}
      >
        <form
          onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)}
          className="flex flex-col w-full h-full"
        >
          <h2>Create a new password</h2>
          <div className="w-full h-full flex flex-col  rounded-lg py-4">
            <Input
              control={control}
              name="password"
              label="Password"
              type="password"
              placeholder="Password (min 8 characters)"
              errors={errors}
            />
            <Input
              control={control}
              name="repeatPassword"
              label="Repeat password"
              type="password"
              placeholder="Confirm password"
              errors={errors}
            />
          </div>
          <Button
            isDisabled={isUpdatingPassword}
            className="self-end mb-4"
            label="Submit"
          />
        </form>
      </Dialog>
    </>
  );
};

export { ChangePasswordMenu };
