import { StateCreator } from "zustand";
import { ListAccounts } from "../components/apps/settings/account/ListAccounts";

export interface AccountsSlice {
  AccountsOption: React.ElementType;
  AccountsProps?: Record<string, any>;
  resetAccountsOption: () => void;
  setAccountsOption: (
    newOption: React.ElementType,
    newProps?: Record<string, any>,
  ) => void;
}

const createAccountsSlice: StateCreator<AccountsSlice> = (set) => ({
  AccountsOption: ListAccounts,
  AccountsProps: {},

  resetAccountsOption: () =>
    set(() => ({
      AccountsOption: ListAccounts,
      AccountsProps: {},
    })),

  setAccountsOption: (
    newOption: React.ElementType,
    newProps: Record<string, any> = {},
  ) =>
    set(() => ({
      AccountsOption: newOption,
      AccountsProps: newProps,
    })),
});

export default createAccountsSlice;
