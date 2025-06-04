import { FC } from "react";
import { SignInForm } from "./components/components";
import { AppLink } from "~/libs/components/components";
import { AppRoute } from "~/libs/enums/app-route.enum";

const SignInPage: FC = () => {
  return (
    <div className="w-full flex items-center flex-col gap-y-[24px] px-[12px]">
      <h2>Sign In</h2>
      <SignInForm />
      <p>
        Don&apos;t have an account?{" "}
        <AppLink className="text-primary" href={AppRoute.SIGN_UP}>
          Sign Up
        </AppLink>
      </p>
    </div>
  );
};

export { SignInPage };
