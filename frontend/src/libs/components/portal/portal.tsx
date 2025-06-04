"use client";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps extends PropsWithChildren {
  className?: string;
}

const Portal: FC<PortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(<>{children}</>, document.body);
};

export { Portal };
