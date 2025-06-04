import { MapLocation } from "shared/build";
import { create } from "zustand";

type OrderStore = {
  destination: MapLocation | null;
  entryPoint: MapLocation | null;
  weight: string | null;
};

type OrderActions = {
  setDestination: (
    destination:
      | MapLocation
      | null
      | ((prevState: MapLocation | null) => MapLocation | null),
  ) => void;
  setEntryPoint: (
    entryPoint:
      | MapLocation
      | null
      | ((prevState: MapLocation | null) => MapLocation | null),
  ) => void;
  setWeight: (weight: string | null) => void;
  resetOrder: () => void;
};

const useOrderStore = create<OrderStore & OrderActions>((set) => ({
  destination: null,
  entryPoint: null,
  weight: null,
  setDestination: (destination) =>
    set((state) => ({
      destination:
        typeof destination === "function"
          ? destination(state.destination)
          : destination,
    })),
  setEntryPoint: (entryPoint) =>
    set((state) => ({
      entryPoint:
        typeof entryPoint === "function"
          ? entryPoint(state.entryPoint)
          : entryPoint,
    })),
  setWeight: (weight) => set(() => ({ weight })),
  resetOrder: () =>
    set(() => ({
      destination: null,
      entryPoint: null,
      weight: null,
    })),
}));

export { useOrderStore };
