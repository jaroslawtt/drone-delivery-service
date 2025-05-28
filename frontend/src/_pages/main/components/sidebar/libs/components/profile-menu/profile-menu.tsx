"use client";
import { ChevronRight } from "lucide-react";
import { FC, useState } from "react";
import { type UserGetAllItemReponseDto } from "~/packages/users/users";
import { Dialog } from "~/libs/components/components";
import {
  ChangePasswordMenu,
  LogoutMenuItem,
  PersonalDataMenu,
  DeleteAccountItem,
} from "./libs/components/components";

type Properties = {
  user: UserGetAllItemReponseDto;
};

const ProfileMenu: FC<Properties> = ({ user }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center w-full gap-x-4 p-6 bg-white rounded-b-xl"
      >
        <div className="h-12 aspect-square rounded-full bg-secondary"></div>
        <div className="flex justify-between items-center gap-x-4 w-full">
          <div className="flex flex-col justify-between h-full text-nowrap">
            <span className="text-lg">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-sm text-secondary">My profile</span>
          </div>
          <ChevronRight className="text-secondary" />
        </div>
      </div>
      <Dialog
        className="z-[120] bg-gray-100"
        isOpen={isOpen}
        onCloseClick={() => setIsOpen((state) => !state)}
      >
        <div className="h-full w-full">
          <h2>Profile</h2>
          <div className="w-full flex flex-col justify-center items-center gap-y-4">
            <div className="w-20 h-20 rounded-full bg-tertiary"></div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-xl">
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <span>{user.email}</span>
            </div>
          </div>
          <div className="w-full flex flex-col mt-4 bg-white rounded-lg px-4 py-2">
            <PersonalDataMenu />
            <ChangePasswordMenu />
            <DeleteAccountItem />
            <LogoutMenuItem />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export { ProfileMenu };
