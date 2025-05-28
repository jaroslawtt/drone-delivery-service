import Link from "next/link";
import { FC, HTMLAttributeAnchorTarget, PropsWithChildren } from "react";
import { AppRoute } from "~/libs/enums/enums";
import { type ValueOf } from "~/libs/types/types";

type Properties = {
  className?: string;
} & PropsWithChildren &
  (
    | {
        href: string;
        target: HTMLAttributeAnchorTarget;
      }
    | {
        target?: "_self" | undefined;
        href: ValueOf<typeof AppRoute>;
      }
  );

const AppLink: FC<Properties> = ({
  href,
  target = "_self",
  children,
  className,
}: Properties) => {
  return (
    <Link className={className} href={href} target={target}>
      {children}
    </Link>
  );
};

export { AppLink };
