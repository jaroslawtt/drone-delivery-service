"use client";
import { FC, PropsWithChildren, useState, useRef, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { cnMerge } from "~/libs/helpers/cn-merge";
import { Icon } from "../components";

type Properties = {
  initialHeight?: number;
  className?: string;
  isWrappedInit?: boolean;
} & PropsWithChildren;

const DEFAULT_INITIAL_HEIGHT = 60;

const Menu: FC<Properties> = ({
  children,
  className,
  initialHeight = DEFAULT_INITIAL_HEIGHT,
  isWrappedInit = false,
}: Properties) => {
  const [isOpen, setIsOpen] = useState<boolean>(isWrappedInit);
  const [draggedHeight, setDraggedHeight] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [maxHeight, setMaxHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight * 0.8 : 600,
  );

  useEffect(() => {
    const updateMaxHeight = () => {
      if (typeof window !== "undefined") {
        setMaxHeight(window.innerHeight * 0.8);
      }
    };
    window.addEventListener("resize", updateMaxHeight);
    updateMaxHeight(); // Initial set
    return () => window.removeEventListener("resize", updateMaxHeight);
  }, []);

  const heightAtDragStart = useRef<number>(0);

  const handleDragStart = () => {
    if (menuRef.current) {
      if (draggedHeight !== null) {
        heightAtDragStart.current = draggedHeight;
      } else if (isOpen) {
        heightAtDragStart.current = menuRef.current.offsetHeight;
      } else {
        heightAtDragStart.current = initialHeight;
      }
    }
  };

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (menuRef.current) {
      let newHeight = heightAtDragStart.current - info.offset.y;

      newHeight = Math.max(initialHeight, newHeight);
      newHeight = Math.min(maxHeight, newHeight);

      setDraggedHeight(newHeight);

      if (Math.abs(newHeight - initialHeight) < 20) {
        if (isOpen) setIsOpen(false);
      } else {
        if (!isOpen) setIsOpen(true);
      }
    }
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const velocity = info.velocity.y;

    if (velocity > 0) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }

    setDraggedHeight(null);
  };

  const toggleOpen = () => {
    setDraggedHeight(null);
    setIsOpen((prev) => !prev);
  };

  const getAnimatedHeight = () => {
    if (draggedHeight !== null) {
      return draggedHeight;
    }
    return isOpen ? "auto" : initialHeight;
  };

  return (
    <motion.div
      ref={menuRef}
      layout
      initial={{ height: isWrappedInit ? "auto" : initialHeight }}
      animate={{
        height: getAnimatedHeight(),
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 30,
      }}
      className={cnMerge(
        "bg-white rounded-t-[10px] w-screen fixed bottom-0 left-0 z-50",
        "overflow-hidden",
        className,
      )}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={toggleOpen}
        className="absolute top-0 left-0 right-0 h-[40px] flex justify-center items-center cursor-grab active:cursor-grabbing pt-[12px] z-10"
        aria-label={isOpen ? "Collapse menu" : "Expand menu"}
        role="button"
        style={{ touchAction: "none" }}
      ></motion.div>
      <div className="relative">
        <Icon
          className="absolute top-5 left-1/2 transform -translate-x-1/2  w-[22px] h-[8px] text-grey pointer-events-none"
          iconName="menu-burger"
        />
      </div>
      <motion.div className="pt-[40px] px-[25px] pb-[25px]" layout="position">
        {children}
      </motion.div>
    </motion.div>
  );
};

export { Menu };
