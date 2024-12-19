import { Dispatch, SetStateAction } from "react";

import { User } from "../interfaces/authentication/authentication.interface";
import { InitialState } from "../interfaces/context/OS.interface";

export const setCurrentUser =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (newUser: User) => {
    setStepGlobal((prev) => {
      if (prev) {
        return {
          ...prev,
          currentUser: newUser,
        };
      } else {
        return prev;
      }
    });
  };
