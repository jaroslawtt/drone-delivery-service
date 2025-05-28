"use client";
import { BadgeAlert } from "lucide-react";
import { FC, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/libs/helpers/helpers";
import { Alert, AlertDescription, AlertTitle } from "~/libs/ui/alert";
import { useNotifyStore } from "~/stores/notify/notify";

const Notify: FC = () => {
  const notify = useNotifyStore((state) => state.notify);
  const setNotify = useNotifyStore((state) => state.setNotify);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (notify) {
      timer = setTimeout(() => {
        setNotify(null);
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [notify, setNotify]);

  const alertVariants = {
    hidden: {
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    visible: {
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30, delay: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <AnimatePresence>
      {notify && (
        <motion.div
          key="notify-alert"
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "z-[9999] w-[90%] absolute top-4 left-1/2 -translate-x-1/2",
          )}
          onClick={() => setNotify(null)}
        >
          <Alert
            className={cn("h-auto bg-white", {
              "border-red-500 text-red-500": notify.status === "error",
              "border-green-500 text-green-500": notify.status === "success",
              "border-yellow-500 text-yellow-500": notify.status === "warning",
            })}
          >
            <BadgeAlert
              className={cn("h-4 w-4", {
                "text-green-500": notify.status === "success",
                "text-red-500": notify.status === "error",
                "text-yellow-500": notify.status === "warning",
              })}
            />
            <AlertTitle>{notify.title}</AlertTitle>
            <AlertDescription>{notify.message}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Notify };
