"use client";
import { useState } from "react";

const useMenuOpen = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsOpen((state) => !state);

  return { isOpen, toggleMenu };
};

export { useMenuOpen };
