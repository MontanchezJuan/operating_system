import { StateCreator } from "zustand";

export interface FileInstance {
  windowId: string;
  fileName: string;
  filePath: string;
  fileContent: string | null;
}

export interface FilesSlice {
  fileInstances: FileInstance[];
  openFile: (
    windowId: string,
    fileName: string,
    filePath: string,
    fileContent: string | null,
  ) => void;
  closeFile: (windowId: string) => void;
}

const createFilesSlice: StateCreator<FilesSlice> = (set) => ({
  fileInstances: [],

  openFile: (windowId, fileName, filePath, fileContent) =>
    set((state) => ({
      fileInstances: [
        ...state.fileInstances,
        { windowId, fileName, filePath, fileContent },
      ],
    })),

  closeFile: (windowId) =>
    set((state) => ({
      fileInstances: state.fileInstances.filter(
        (instance) => instance.windowId !== windowId,
      ),
    })),
});

export default createFilesSlice;
