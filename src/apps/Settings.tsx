import { LiaCogSolid } from "react-icons/lia";

import { App } from "../interfaces/App.interface";
import useStore from "../store/useStore";

const Settings = () => {
  const SettingsOption = useStore((store) => store.SettingsOption);

  return <SettingsOption />;
};

export const SettingsApp: App = {
  app: Settings,
  icon: LiaCogSolid,
  isFullwindow: true,
  manyWindows: false,
  memory: 1,
  name: "Settings",
  onClose: () => {
    useStore.getState().resetSettingsOption();
    useStore.getState().resetAccountsOption();
  },
};
