"use client";
import { FC, PropsWithChildren, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { cnMerge } from "~/libs/helpers/cn-merge"; // Assuming you have a utility like this

interface SideMenuProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const SideMenu: FC<SideMenuProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const menuVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 75, damping: 25 },
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 75, damping: 25 },
    },
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const menuNode = menuRef.current;
    if (!menuNode) return;

    if (info.velocity.x < 0) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[90] bg-black/50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="sidemenu"
            ref={menuRef}
            className={cnMerge(
              "fixed top-0 left-0 h-full w-[80vw] max-w-md bg-white z-[100] shadow-xl rounded-r-xl overflow-y-auto cursor-grab",
              className,
            )}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            drag="x"
            dragConstraints={{ right: 0 }}
            dragElastic={{ left: 0.1, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: "grabbing" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sidemenu-title"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { SideMenu };
