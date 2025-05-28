"use client";
import { Button, Input } from "~/libs/components/components";
import { useAppForm } from "~/libs/hooks/hooks";
import {
  authApi,
  authSignInValidationSchema,
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  type AuthSignInRequestDto,
  type AuthSignInResponseDto,
} from "~/packages/auth/auth";
import { DEFAULT_SIGN_IN_PAYLOAD } from "./libs/constants";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "~/stores/auth/auth";

const SignInForm = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate: handleSignIn, isPending: isSignInPending } = useMutation({
    mutationFn: authApi.signIn.bind(authApi),
    onError: (error) => {
      return void console.error("Error during sign in:", error);
    },
    onSuccess: (payload: AuthSignInResponseDto) => {
      setUser(payload.user);
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, payload.accessToken);
    },
  });
  const { control, errors, handleSubmit } = useAppForm<AuthSignInRequestDto>({
    defaultValues: DEFAULT_SIGN_IN_PAYLOAD,
    validationSchema: authSignInValidationSchema,
  });

  const onSubmit = (payload: AuthSignInRequestDto) => handleSignIn(payload);
  const handleFormSubmit = (event_: React.BaseSyntheticEvent): void =>
    void handleSubmit(onSubmit)(event_);

  return (
    <form className="w-full grid gap-y-[12px]" onSubmit={handleFormSubmit}>
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        name="email"
        control={control}
        errors={errors}
      />
      <Input
        label="Password"
        placeholder="Enter your password"
        name="password"
        control={control}
        errors={errors}
      />
      <Button isDisabled={isSignInPending} label="Sign In" className="mt-4" />
    </form>
  );
};

export { SignInForm };
