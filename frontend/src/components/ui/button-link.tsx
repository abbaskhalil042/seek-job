import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof Button>;
type LinkProps = ComponentProps<typeof Link>;

/**
 * A Button that navigates like a Link.
 *
 * Base UI's <Button> renders a native <button> by default; rendering it as an
 * anchor requires the `render` prop AND `nativeButton={false}`. This wrapper
 * encapsulates that so call-sites stay clean: <ButtonLink href="/x">Go</ButtonLink>.
 */
export function ButtonLink({
  href,
  prefetch,
  replace,
  scroll,
  children,
  ...buttonProps
}: Omit<ButtonProps, "render" | "nativeButton"> &
  Pick<LinkProps, "href" | "prefetch" | "replace" | "scroll">) {
  return (
    <Button
      nativeButton={false}
      render={
        <Link href={href} prefetch={prefetch} replace={replace} scroll={scroll} />
      }
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
