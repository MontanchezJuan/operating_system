import { create } from "zustand";
import createAccountsSlice, { AccountsSlice } from "./createAccountsSlice";
import createAppsSlice, { AppsSlice } from "./createAppsSlice";
import createConfigsSlice, { ConfigsSlice } from "./createConfigsSlice";
import createFilesSlice, { FilesSlice } from "./createFilesSlice";
import createSettingsSlice, { SettingsSlice } from "./createSettingsSlice";
import createTaskManagerSlice, {
  TaskManagerSlice,
} from "./createTaskManagerSlice";

const useStore = create<
  AccountsSlice &
    AppsSlice &
    ConfigsSlice &
    FilesSlice &
    SettingsSlice &
    TaskManagerSlice
>()((...a) => ({
  ...createAccountsSlice(...a),
  ...createAppsSlice(...a),
  ...createConfigsSlice(...a),
  ...createFilesSlice(...a),
  ...createSettingsSlice(...a),
  ...createTaskManagerSlice(...a),
}));

export default useStore;
