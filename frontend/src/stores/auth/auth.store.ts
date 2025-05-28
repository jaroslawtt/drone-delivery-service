import { create } from "zustand";
import { type UserGetAllItemReponseDto } from "~/packages/users/users";

type AuthStore = {
  user: UserGetAllItemReponseDto | null;
};

type AuthActions = {
  setUser: (user: UserGetAllItemReponseDto | null) => void;
};

const useAuthStore = create<AuthStore & AuthActions>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));

export { useAuthStore };
