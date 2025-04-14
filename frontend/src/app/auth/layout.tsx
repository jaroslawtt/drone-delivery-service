import { FC, ReactNode } from "react";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {children}
    </div>
  );
};

export default AuthLayout;
