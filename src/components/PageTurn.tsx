"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { nav } from "@/data/site";

type Dir = 1 | -1;
type Ctx = {
  go: (href: string) => void;
  dragX: number;
  isDragging: boolean;
  targetChapter: (typeof nav)[0] | null;
  leaving: string | null;
  isTurning: boolean;
  dir: Dir;
  step: (d: Dir) => void;
};

const TurnContext = createContext<Ctx>({
  go: () => {},
  dragX: 0,
  isDragging: false,
  targetChapter: null,
  leaving: null,
  isTurning: false,
  dir: 1,
  step: () => {},
});

export const useTurn = () => useContext(TurnContext);

function indexOf(pathname: string) {
  const i = nav.findIndex((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)));
  return i < 0 ? 0 : i;
}

/** Wraps the site: provides instant route navigation with zero page-turning animation. */
export function TurnProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const go = useCallback(
    (href: string) => {
      if (href === pathname) return;
      router.push(href);
    },
    [pathname, router],
  );

  const step = useCallback(
    (d: Dir) => {
      const curIdx = indexOf(pathname);
      const next = nav[curIdx + d];
      if (next) router.push(next.href);
    },
    [pathname, router],
  );

  const value = useMemo(
    () => ({
      go,
      dragX: 0,
      isDragging: false,
      targetChapter: null,
      leaving: null,
      isTurning: false,
      dir: 1 as Dir,
      step,
    }),
    [go, step],
  );

  return (
    <TurnContext.Provider value={value}>
      <div className="turn-root">
        {children}
      </div>
    </TurnContext.Provider>
  );
}

/** The page content container: renders children directly without transition delays, clones, or 3D rotations. */
export function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="sheet-content">
      {children}
    </div>
  );
}
