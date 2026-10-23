import { createContext, useContext } from "react";
import type { NavKey, Role } from "./data";

export type Settings = {
  logoText: string;
  accent: string;
  theme: "light" | "dark";
  aiEnabled: boolean;
  taxEnabled: boolean;
  bankName: string;
  routing: string;
  account: string;
  swift: string;
  sow: string;
};

type Ctx = { settings: Settings; setSettings: (s: Partial<Settings>) => void; role: Role; go: (k: NavKey) => void };
export const PortalCtx = createContext<Ctx>(null!);
export const usePortal = () => useContext(PortalCtx);

export const ACCENTS = [
  { name: "Emerald", value: "oklch(0.62 0.15 160)" },
  { name: "Cobalt", value: "oklch(0.55 0.19 255)" },
  { name: "Copper", value: "oklch(0.62 0.15 50)" },
  { name: "Crimson", value: "oklch(0.56 0.2 20)" },
  { name: "Gold", value: "oklch(0.72 0.14 85)" },
  { name: "Slate", value: "oklch(0.4 0.03 260)" },
];

