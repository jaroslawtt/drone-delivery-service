"use client";
import { Lightbulb, Megaphone } from "lucide-react";
import { Dialog } from "~/libs/components/components";
import { useMenuOpen } from "~/libs/hooks/hooks";

const NewsMenu = () => {
  const { isOpen, toggleMenu } = useMenuOpen();

  return (
    <>
      <div onClick={toggleMenu} className="flex gap-x-4 items-center">
        <Lightbulb className="text-tertiary" />
        <span>News</span>
      </div>
      <Dialog
        className="z-[120] bg-gray-100"
        isOpen={isOpen}
        onCloseClick={toggleMenu}
      >
        <div className="w-full h-full flex-grow max-h-full flex flex-col">
          <h2>News</h2>
          <div className="flex-grow w-full flex flex-col items-center justify-center">
            <Megaphone className="w-32 h-32  text-tertiary" />
            <h3 className="text-center text-2xl font-semibold text-tertiary">
              Here will be important news and great offers
            </h3>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export { NewsMenu };
