"use client";

import Link from "next/link";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

/** Clean navigation link without page-turning animations. */
export default function TurnLink({ href, onClick, children, ...rest }: Props) {
  return (
    <Link href={href} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
