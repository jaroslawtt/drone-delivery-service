"use client";
import { FC } from "react";
import { useAppForm } from "~/libs/hooks/hooks";
import {
  authApi,
  type AuthSignUpRequestDto,
  type AuthSignUpResponseDto,
  authSignUpValidationSchema,
} from "~/packages/auth/auth";
import { DEFAULT_SIGN_IN_PAYLOAD } from "./libs/constants";
import { Button, Input } from "~/libs/components/components";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "~/stores/auth/auth";

const SignUpForm: FC = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate: handleSignUp, isPending: isSignUpRequestPending } =
    useMutation({
      mutationFn: authApi.signUp.bind(authApi),
      onError: (error) => {
        console.error("Error during sign up:", error);
      },
      onSuccess: (payload: AuthSignUpResponseDto) => {
        setUser(payload.user);
        localStorage.setItem("accessToken", payload.accessToken);
      },
    });
  const { control, errors, handleSubmit } = useAppForm<AuthSignUpRequestDto>({
    defaultValues: DEFAULT_SIGN_IN_PAYLOAD,
    validationSchema: authSignUpValidationSchema,
    mode: "onChange",
  });

  const onSubmit = (payload: AuthSignUpRequestDto) => handleSignUp(payload);
  const handleFormSubmit = (event_: React.BaseSyntheticEvent): void =>
    void handleSubmit(onSubmit)(event_);

  return (
    <form className="w-full grid" onSubmit={handleFormSubmit}>
      <Input
        label="First name"
        type="text"
        placeholder="John"
        name="firstName"
        control={control}
        errors={errors}
      />
      <Input
        label="Last name"
        type="text"
        placeholder="Doe"
        name="lastName"
        control={control}
        errors={errors}
      />
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        name="email"
        control={control}
        errors={errors}
      />
      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        name="password"
        control={control}
        errors={errors}
      />
      <Button
        isDisabled={isSignUpRequestPending}
        label="Sign Up"
        className="mt-4"
      />
    </form>
  );
};

export { SignUpForm };
