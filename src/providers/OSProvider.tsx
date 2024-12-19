import React, { ReactNode, useEffect, useState } from "react";

import { setCurrentUser } from "../actions/OSActions";
import OSContext from "../context/OSContext";
import { InitialState } from "../interfaces/context/OS.interface";
import { get_last_user } from "../utils/invoke";

const InitialStep: InitialState = {
  currentUser: {
    username: "",
    password: "",
    role: "",
    photo: "",
    background: "",
  },
};

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stepGlobal, setStepGlobal] = useState<InitialState>(InitialStep);

  const getInitialState = async () => {
    try {
      const res = await get_last_user();
      setStepGlobal((prevState) => ({
        ...prevState,
        currentUser: res,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getInitialState();
  }, []);

  return (
    <OSContext.Provider
      value={{
        ...stepGlobal,
        setCurrentUser: setCurrentUser(setStepGlobal),
      }}
    >
      {children}
    </OSContext.Provider>
  );
};
