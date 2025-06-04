import { create } from "zustand";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "~/packages/auth/auth";
import { type UserGetAllItemReponseDto } from "~/packages/users/users";

type AuthStore = {
  user: UserGetAllItemReponseDto | null;
};

type AuthActions = {
  setUser: (user: UserGetAllItemReponseDto | null) => void;
  logout: () => void;
};

const useAuthStore = create<AuthStore & AuthActions>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  logout: () =>
    set(() => {
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);

      return { user: null };
    }),
}));

export { useAuthStore };
