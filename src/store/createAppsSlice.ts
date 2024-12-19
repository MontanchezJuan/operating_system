import { v4 as uuidv4 } from "uuid";
import { StateCreator } from "zustand";
import { App, WindowState } from "../interfaces/App.interface";

export interface AppsSlice {
  apps: Record<string, WindowState[]>;
  currentApp: WindowState | null;
  memory: number;
  addNumbertoMemory: (newMemory: number) => void;
  changeCurrentApp: () => void;
  closeApp: (windowId: string) => void;
  focusApp: (windowId: string) => void;
  minimizeApp: (windowId: string) => void;
  openApp: (app: App, id?: string) => void;
  resizeApp: (windowId: string, width: number, height: number) => void;
  restoreApp: (windowId: string) => void;
  setIsFullwindow: (windowId: string) => void;
  signOut: () => void;
  subtractionNumbertoMemory: (newMemory: number) => void;
}

const createAppsSlice: StateCreator<AppsSlice> = (set) => ({
  apps: {},
  currentApp: null,
  memory: 0,

  addNumbertoMemory: (newMemory: number) =>
    set((state) => ({ memory: state.memory + newMemory })),

  changeCurrentApp: () =>
    set((state) => ({ apps: state.apps, currentApp: null })),

  closeApp: (windowId: string) =>
    set((state) => {
      const updatedApps = Object.fromEntries(
        Object.entries(state.apps)
          .map(([appName, instances]) => [
            appName,
            instances.filter((instance) => instance.windowId !== windowId),
          ])
          .filter(([_, instances]) => instances.length > 0),
      );

      const isCurrentFocusedWindowClosed =
        state.currentApp?.windowId === windowId;

      return {
        apps: updatedApps,
        currentApp: isCurrentFocusedWindowClosed ? null : state.currentApp,
      };
    }),

  focusApp: (windowId: string) =>
    set((state) => {
      if (state.currentApp) {
        state.currentApp.isFocused = false;
      }

      const newFocusedWindow = Object.values(state.apps)
        .flat()
        .find((instance) => instance.windowId === windowId);

      if (newFocusedWindow) {
        newFocusedWindow.isFocused = true;
      }

      return {
        apps: { ...state.apps },
        currentApp: newFocusedWindow || null,
      };
    }),

  minimizeApp: (windowId: string) =>
    set((state) => {
      if (state.currentApp === null) return state;

      const isCurrentFocusedWindow = state.currentApp.windowId === windowId;
      if (isCurrentFocusedWindow) {
        state.currentApp.isFocused = false;
      }

      return {
        apps: Object.fromEntries(
          Object.entries(state.apps).map(([appName, instances]) => [
            appName,
            instances.map((instance) =>
              instance.windowId === windowId
                ? { ...instance, isMinimized: true, isFocused: false }
                : instance,
            ),
          ]),
        ),
        currentApp: isCurrentFocusedWindow ? null : state.currentApp,
      };
    }),

  openApp: (app, id) =>
    set((state) => {
      const appInstances = state.apps[app.name] || [];
      const newWindowId = uuidv4();

      if (state.currentApp) {
        state.currentApp.isFocused = false;
      }

      const newWindowState: WindowState = {
        app,
        windowId: id || newWindowId,
        isFocused: true,
        isFullWindow: app.isFullwindow,
        isMinimized: false,
        width: 800,
        height: 400,
      };

      return {
        apps: {
          ...state.apps,
          [app.name]: app.manyWindows
            ? [...appInstances, newWindowState]
            : [newWindowState],
        },
        currentApp: newWindowState,
      };
    }),

  resizeApp: (windowId: string, width: number, height: number) =>
    set((state) => {
      return {
        apps: Object.fromEntries(
          Object.entries(state.apps).map(([appName, instances]) => [
            appName,
            instances.map((instance) =>
              instance.windowId === windowId
                ? { ...instance, width, height }
                : instance,
            ),
          ]),
        ),
      };
    }),

  restoreApp: (windowId: string) =>
    set((state) => {
      if (state.currentApp) {
        state.currentApp.isFocused = false;
      }

      const restoredWindow = Object.values(state.apps)
        .flat()
        .find((instance) => instance.windowId === windowId);

      if (restoredWindow) {
        restoredWindow.isMinimized = false;
        restoredWindow.isFocused = true;
      }

      return {
        apps: { ...state.apps },
        currentApp: restoredWindow || null,
      };
    }),

  setIsFullwindow: (windowId: string) =>
    set((state) => {
      return {
        apps: Object.fromEntries(
          Object.entries(state.apps).map(([appName, instances]) => [
            appName,
            instances.map((instance) =>
              instance.windowId === windowId
                ? { ...instance, isFullWindow: !instance.isFullWindow }
                : instance,
            ),
          ]),
        ),
      };
    }),

  signOut: () =>
    set(() => ({
      apps: {},
      currentApp: null,
      memory: 0,
    })),

  subtractionNumbertoMemory: (newMemory: number) =>
    set((state) => ({ memory: state.memory - newMemory })),
});

export default createAppsSlice;
