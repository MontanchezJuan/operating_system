import { StateCreator } from "zustand";
import { ProcessesItem } from "../components/apps/task_manager/Processes.Item";

export interface TaskManagerOptionInterface {
  option: React.ElementType;
  name: string;
}

export interface TaskManagerSlice {
  TaskManagerOption: TaskManagerOptionInterface;
  resetTaskManagerOption: () => void;
  setTaskManagerOption: (newOption: TaskManagerOptionInterface) => void;
}

const createTaskManagerSlice: StateCreator<TaskManagerSlice> = (set) => ({
  TaskManagerOption: { option: ProcessesItem, name: "ProcessesItem" },

  resetTaskManagerOption: () =>
    set(() => {
      return {
        TaskManagerOption: { option: ProcessesItem, name: "ProcessesItem" },
      };
    }),

  setTaskManagerOption: (newOption: TaskManagerOptionInterface) =>
    set((state) => {
      if (newOption) {
        return {
          TaskManagerOption: newOption,
        };
      }
      return state;
    }),
});

export default createTaskManagerSlice;
