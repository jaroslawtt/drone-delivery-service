"use client";
import { ProfileMenuItem } from "../profile-menu-item";
import { CircleUser } from "lucide-react";
import {
  UserGetAllItemReponseDto,
  UserUpdateRequestDto,
} from "~/packages/users/libs/types/types";
import { Button, Dialog, Input } from "~/libs/components/components";
import { useAppForm, useMenuOpen } from "~/libs/hooks/hooks";
import { userApi, userUpdateValidationSchema } from "~/packages/users/users";
import { useAuthStore } from "~/stores/auth/auth.store";
import { useMutation } from "@tanstack/react-query";
import { useNotifyStore } from "~/stores/notify/notify.store";

const PersonalDataMenu = () => {
  const { isOpen, toggleMenu } = useMenuOpen();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setNotify = useNotifyStore((state) => state.setNotify);

  const { control, errors, handleReset, handleSubmit } =
    useAppForm<UserUpdateRequestDto>({
      validationSchema: userUpdateValidationSchema,
      defaultValues: {
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
      },
    });

  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useMutation<
    UserGetAllItemReponseDto,
    Error,
    UserUpdateRequestDto
  >({
    mutationFn: userApi.updateUser.bind(userApi),
    onSuccess: (updatedUserData) => {
      setNotify({
        status: "success",
        title: "Update produced",
        message: "Personal data updated successfully",
      });

      setUser(updatedUserData);
      handleCloseDialog();
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });

  const handleCloseDialog = () => {
    toggleMenu();
    return void handleReset();
  };

  const handleValidSubmit = (data: UserUpdateRequestDto) => {
    updateUser(data);
  };

  return (
    <>
      <ProfileMenuItem
        label="Personal Data"
        icon={<CircleUser className="text-tertiary" />}
        onClick={toggleMenu}
      />
      <Dialog
        className="z-[140] bg-gray-100 overflow-hidden"
        isOpen={isOpen}
        onCloseClick={handleCloseDialog}
      >
        <form
          onSubmit={handleSubmit(handleValidSubmit)}
          className="flex flex-grow w-full h-full max-h-full flex-col"
        >
          <h2>Personal Data</h2>
          <div className="w-full flex flex-col flex-grow mt-2">
            <Input
              label="First Name"
              name="firstName"
              control={control}
              errors={errors}
            />
            <Input
              label="Last Name"
              name="lastName"
              control={control}
              errors={errors}
            />
          </div>
          <Button
            isDisabled={isUpdatingUser}
            className="self-end mb-4"
            label="Submit"
          />
        </form>
      </Dialog>
    </>
  );
};

export { PersonalDataMenu };
