import { FC, PropsWithChildren } from "react";
import { Map } from "~/libs/components/components";
import { Sidebar } from "~/_pages/main/components/sidebar/sidebar";

type Properties = PropsWithChildren;

const RootLayout: FC<Properties> = ({ children }: Properties) => {
  return (
    <main className="relative h-[100dvh] w-screen">
      <div className="absolute inset-0 z-0">
        <Map />
      </div>
      <Sidebar />
      <div className="absolute z-10 w-full bottom-0 h-auto pointer-events-auto overflow-y-auto overscroll-contain">
        {children}
      </div>
    </main>
  );
};

export default RootLayout;
