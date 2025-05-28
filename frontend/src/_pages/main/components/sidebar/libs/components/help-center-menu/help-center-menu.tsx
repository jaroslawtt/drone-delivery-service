"use client";
import Link from "next/link";
import { Dialog, Icon } from "~/libs/components/components";
import { useMenuOpen } from "~/libs/hooks/hooks";

const HelpCenterMenu = () => {
  const { isOpen, toggleMenu } = useMenuOpen();

  return (
    <>
      <h3 onClick={toggleMenu}>Help Center</h3>
      <Dialog
        className="z-[120] bg-gray-100"
        isOpen={isOpen}
        onCloseClick={toggleMenu}
      >
        <div className="w-full h-full flex-grow max-h-full flex flex-col">
          <h2>Help Center</h2>
          <div className="w-full flex flex-col">
            <p className="my-4">Contact</p>
            <Link
              href="https://t.me/jaroslawq"
              target="_blank"
              className="w-full bg-white px-2 py-4 rounded-lg flex items-center gap-x-1"
            >
              <Icon iconName="telegram" className="w-6 h-6" />
              <span>Telegram: @jaroslawq</span>
            </Link>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export { HelpCenterMenu };
