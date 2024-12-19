/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement } from "react";

import { Authentication } from "./Authentication";
import { Desktop } from "./Desktop";

export interface Page {
  component: ReactElement<any, any>;
  path: string;
  name: string;
}

export const PAGES: Page[] = [
  { component: <Authentication />, path: "/", name: "Autenticación" },
  { component: <Desktop />, path: "/desktop", name: "Escritorio" },
];
