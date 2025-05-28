"use client";

import { LogOut } from "lucide-react";
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
import { useAuthStore } from "~/stores/auth/auth.store";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "~/packages/auth/auth";

const LogoutMenuItem = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const handleSignOut = () => {
    window.localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);

    return void setUser(null);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ProfileMenuItem
          label="Sign Out"
          icon={<LogOut className="text-tertiary" />}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="z-[9999] max-w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to sign out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSignOut}
            className="bg-transparent border border-red-500 text-red-500 hover:bg-transparent focus:bg-transparent"
          >
            Sign Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { LogoutMenuItem };
