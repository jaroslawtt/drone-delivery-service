import { create } from "zustand";

type MapStore = {
  canSetRoute: boolean;
  setCanSetRoute: (canSetRoute: boolean) => void;
};

const useMapStore = create<MapStore>((set) => ({
  canSetRoute: false,
  setCanSetRoute: (canSetRoute) => set({ canSetRoute }),
}));

export { useMapStore };
