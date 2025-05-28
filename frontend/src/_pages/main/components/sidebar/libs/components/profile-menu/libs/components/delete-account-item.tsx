"use client";

import { Trash } from "lucide-react";
import { ProfileMenuItem } from "./profile-menu-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/libs/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "~/packages/users/users";
import { useAuthStore } from "~/stores/auth/auth";

const DeleteAccountItem = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate: deleteAccount } = useMutation({
    mutationFn: userApi.deleteAccount.bind(userApi),
    onSuccess: () => {
      setUser(null);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ProfileMenuItem
          label="Delete Account"
          icon={<Trash className="text-red-500" />}
          className="text-red-500"
          onClick={() => console.log("delete")}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="z-[9999] max-w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteAccount()}
            className="bg-transparent border border-red-500 text-red-500 hover:bg-transparent focus:bg-transparent"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteAccountItem };
