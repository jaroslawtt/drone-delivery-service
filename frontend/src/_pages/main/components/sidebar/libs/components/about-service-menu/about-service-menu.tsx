"use client";
import { Dialog } from "~/libs/components/components";
import { useMenuOpen } from "~/libs/hooks/hooks";
import { AboutServiceMenuItem } from "./libs/components/components";

const AboutServiceMenu = () => {
  const { isOpen, toggleMenu } = useMenuOpen();

  return (
    <>
      <h3 onClick={toggleMenu}>About Service</h3>
      <Dialog
        className="z-[120] bg-gray-100"
        isOpen={isOpen}
        onCloseClick={toggleMenu}
      >
        <div className="w-full h-full flex-grow max-h-full flex flex-col">
          <h2>About Service</h2>
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col">
              <p className="my-4">Legal info</p>
              <AboutServiceMenuItem label="User Agreement" />
              <AboutServiceMenuItem label="Privacy Policy" />
            </div>
            <p className="text-tertiary font-semibold text-md">
              App Version 0.0.1
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export { AboutServiceMenu };
