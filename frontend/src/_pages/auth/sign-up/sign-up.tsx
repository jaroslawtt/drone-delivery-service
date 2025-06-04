import { AppLink } from "~/libs/components/components";
import { SignUpForm } from "./components/components";
import { AppRoute } from "~/libs/enums/enums";

const SignUpPage = () => {
  return (
    <div className="w-full flex items-center flex-col gap-y-[24px] px-[12px]">
      <h1>Sign Up</h1>
      <SignUpForm />
      <p>
        Already have an account?{" "}
        <AppLink className="text-primary" href={AppRoute.SIGN_IN}>
          Sign In
        </AppLink>
      </p>
    </div>
  );
};

export { SignUpPage };
