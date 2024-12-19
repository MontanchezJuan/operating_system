import { createContext } from "react";

import { OSContextType } from "../interfaces/context/OS.interface";

const OSContext = createContext<OSContextType | undefined>(undefined);

export default OSContext;
