import { StateCreator } from "zustand";
import { Color } from "../interfaces/context/Config.interface";

export interface Config {
  is_dark_mode: boolean;
  color: Color;
  language: "en" | "es";
}

export interface ConfigsSlice {
  config: Config;
  colorSwitch: (newColor: Color) => void;
  resetConfig: () => void;
  setConfig: (newConfig: Config) => void;
  setLanguage: (newLanguage: "en" | "es") => void;
  themeSwitch: (mode: boolean) => void;
}

//   isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
const config: Config = {
  is_dark_mode: true,
  color: "blue",
  language: "en",
};

const createConfigsSlice: StateCreator<ConfigsSlice> = (set) => ({
  config,

  colorSwitch: (newColor: Color) =>
    set((state) => {
      if (newColor) {
        return {
          config: { ...state.config, color: newColor },
        };
      }
      return state;
    }),

  setConfig: (newConfig: Config) =>
    set((state) => {
      if (newConfig) {
        return {
          config: newConfig,
        };
      }
      return state;
    }),

  resetConfig: () =>
    set(() => {
      return { config: { is_dark_mode: true, color: "blue", language: "en" } };
    }),

  setLanguage: (newLanguage: "en" | "es") =>
    set((state) => {
      return { config: { ...state.config, language: newLanguage } };
    }),

  themeSwitch: (mode: boolean) =>
    set((state) => {
      return {
        config: { ...state.config, is_dark_mode: mode },
      };
    }),
});

export default createConfigsSlice;
