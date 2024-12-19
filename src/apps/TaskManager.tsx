import { useTranslation } from "react-i18next";
import { LiaDesktopSolid } from "react-icons/lia";
import { PerformanceItem } from "../components/apps/task_manager/Performance.Item";
import { ProcessesItem } from "../components/apps/task_manager/Processes.Item";
import { App } from "../interfaces/App.interface";
import { TaskManagerOptionInterface } from "../store/createTaskManagerSlice";
import useStore from "../store/useStore";

const TaskManager = () => {
  const { t } = useTranslation();

  const TaskManagerOption = useStore((store) => store.TaskManagerOption);
  const setTaskManagerOption = useStore((store) => store.setTaskManagerOption);

  const OPTIONS: TaskManagerOptionInterface[] = [
    { name: "ProcessesItem", option: ProcessesItem },
    { name: "PerformanceItem", option: PerformanceItem },
  ];

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex">
        {OPTIONS.map((option) => (
          <button
            className={`flex-grow cursor-pointer p-2 ${
              TaskManagerOption.name === option.name &&
              "rounded-t-lg bg-zinc-600"
            }`}
            key={option.name}
            onClick={() => setTaskManagerOption(option)}
          >
            {t(option.name)}
          </button>
        ))}
      </div>

      <TaskManagerOption.option />
    </div>
  );
};

export const TaskManagerApp: App = {
  app: TaskManager,
  icon: LiaDesktopSolid,
  isFullwindow: false,
  manyWindows: false,
  memory: 1,
  name: "TaskManager",
  onClose: () => {
    useStore.getState().resetTaskManagerOption();
  },
};
