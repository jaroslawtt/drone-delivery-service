"use client";
import { FC, useState } from "react";
import { SideMenu } from "~/libs/components/components";
import { Building2, ChevronRight, MenuIcon } from "lucide-react";
import { useAuthStore } from "~/stores/auth/auth.store";
import {
  HistoryMenu,
  ProfileMenu,
  PaymentMenu,
  NewsMenu,
  HelpCenterMenu,
  AboutServiceMenu,
} from "./libs/components/components";
import { useNotifyStore } from "~/stores/notify/notify";

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setNotify = useNotifyStore((state) => state.setNotify);

  const user = useAuthStore((state) => state.user);

  return (
    <>
      <div className="bg-white rounded-l p-1 absolute top-10 left-5 z-30 shadow-md">
        <MenuIcon onClick={() => setIsOpen(true)} className="text-secondary" />
      </div>
      <SideMenu
        className="bg-gray-100"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex flex-col w-full h-full gap-y-4">
          {user && <ProfileMenu user={user} />}
          <div
            onClick={() =>
              setNotify({
                status: "error",
                title: "Fobidden",
                message: "Selecting city is disabled",
              })
            }
            className="flex justify-between items-center p-6 bg-white rounded-xl w-full opacity-70"
          >
            <div className="flex items-center gap-x-4">
              <Building2 className="text-tertiary" />
              <div className="h-full flex flex-col justify-between">
                <span>City</span>
                <span>Kyiv</span>
              </div>
            </div>
            <ChevronRight className="text-secondary" />
          </div>
          <div className="flex flex-col gap-y-6 bg-white rounded-xl w-full p-6">
            <HistoryMenu />
            <NewsMenu />
            <PaymentMenu />
          </div>
          <div className="p-6 capitalize flex flex-col gap-y-2 text-lg rounded-t-xl bg-white mt-auto">
            <HelpCenterMenu />
            <AboutServiceMenu />
          </div>
        </div>
      </SideMenu>
    </>
  );
};

export { Sidebar };
