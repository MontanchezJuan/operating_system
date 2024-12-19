import { Operadores } from "../../hooks/useCalculadora";

export interface Symbol {
  action?: (texto: Operadores) => void;
  accion?: (text: string) => void;
  equals?: boolean;
  texto?: string;
  text?: Operadores;
}
