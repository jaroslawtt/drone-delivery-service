import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cnMerge = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export { cnMerge };
