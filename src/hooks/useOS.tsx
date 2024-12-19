import { useContext } from "react";
import OSContext from "../context/OSContext";
import { OSContextType } from "../interfaces/context/OS.interface";

export const useOS = (): OSContextType => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error("useOS debe ser usado dentro de un OSProvider");
  }
  return context;
};
