"use client";

import { usePathname } from "next/navigation";
import TurnLink from "@/components/TurnLink";
import { nav, site } from "@/data/site";

export default function Nav() {
  const pathname = usePathname();
  const isMobileNavHidden =
    pathname === "/" ||
    pathname === "/about" ||
    pathname.startsWith("/projects") ||
    pathname === "/writing" ||
    pathname === "/contact";

  return (
    <header className={`nav ${isMobileNavHidden ? "nav-home-mobile-hidden" : ""}`}>
      <TurnLink href="/" className="brand" aria-current={pathname === "/" ? "page" : undefined}>
        Field Journal
      </TurnLink>
      <nav aria-label="Primary">
        <ul>
          {nav
            .filter((n) => n.href !== "/")
            .map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <TurnLink
                    href={item.href}
                    className="navlink mono"
                    aria-current={active ? "page" : undefined}
                  >
                    {item.n} / {item.label}
                  </TurnLink>
                </li>
              );
            })}
        </ul>
      </nav>
      <span className="sr-only">{site.name}</span>
    </header>
  );
}
