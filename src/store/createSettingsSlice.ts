import { StateCreator } from "zustand";
import { SettingsMenu } from "../components/apps/settings/SettingsMenu";

export interface SettingsSlice {
  SettingsOption: React.ElementType;
  resetSettingsOption: () => void;
  setSettingsOption: (newOption: React.ElementType) => void;
}

const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  SettingsOption: SettingsMenu,

  resetSettingsOption: () =>
    set(() => {
      return { SettingsOption: SettingsMenu };
    }),

  setSettingsOption: (newOption: React.ElementType) =>
    set((state) => {
      if (newOption) {
        return {
          SettingsOption: newOption,
        };
      }
      return state;
    }),
});

export default createSettingsSlice;
