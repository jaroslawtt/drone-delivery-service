"use client";
import { FC, PropsWithChildren } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cnMerge } from "~/libs/helpers/cn-merge";
import { Portal } from "../portal/portal";
import { X } from "lucide-react";

type Properties = PropsWithChildren & {
  isOpen: boolean;
  onCloseClick: () => void;
  className?: string;
};

const Dialog: FC<Properties> = ({
  children,
  isOpen,
  onCloseClick,
  className,
}) => {
  const dialogVariants = {
    hidden: {
      y: "100%",
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 25,
      },
    },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 25,
      },
    },
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="dialog"
              role="dialog"
              aria-modal="true"
              className={cnMerge(
                "fixed bottom-0 w-full h-[100dvh] bg-white p-6 z-50 flex flex-col",
                className,
              )}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dialogVariants}
            >
              <div className="relative flex justify-end">
                <X
                  onClick={onCloseClick}
                  className="text-tertiary cursor-pointer"
                />
              </div>
              <div className="flex-grow w-full overflow-auto">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export { Dialog };
