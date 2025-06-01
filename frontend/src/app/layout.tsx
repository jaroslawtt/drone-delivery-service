import { type Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.scss";
import { Notify, Providers } from "~/libs/components/components";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans-3",
});

export const metadata: Metadata = {
  title: "Drone Delivery",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={sourceSans3.variable}>
      <Providers>
        <body>
          {children}
          <Notify />
        </body>
      </Providers>
    </html>
  );
};

export default RootLayout;
