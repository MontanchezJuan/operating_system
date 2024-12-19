import { User } from "../authentication/authentication.interface";

export interface OSContextType {
  currentUser: User;
  setCurrentUser: (newUser: User) => void;
}

export interface InitialState {
  currentUser: User;
}
