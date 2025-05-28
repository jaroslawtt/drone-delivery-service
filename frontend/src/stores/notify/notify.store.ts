import { create } from "zustand";
import { type Notify } from "./libs/types/types";

type NotifyStore = {
  notify: Notify | null;
  setNotify: (notify: Notify | null) => void;
};

const useNotifyStore = create<NotifyStore>((set) => ({
  notify: null,
  setNotify: (notify) => set({ notify }),
}));

export { useNotifyStore };
