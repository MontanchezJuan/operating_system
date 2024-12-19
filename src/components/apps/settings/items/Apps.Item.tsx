import { useTranslation } from "react-i18next";
import { APPS } from "../../../../apps";
import { App } from "../../../../interfaces/App.interface";
import useStore from "../../../../store/useStore";
import { SettingsTemplate } from "../Settings.Template";
import { Submenu } from "../Submenu";

export const AppsItem = () => {
  const { t } = useTranslation();

  const addNumbertoMemory = useStore((store) => store.addNumbertoMemory);
  const openApp = useStore((store) => store.openApp);

  const handleApps = (app: App) => {
    openApp(app);
    addNumbertoMemory(app.memory);
  };

  return (
    <div className="flex h-full w-full">
      <Submenu />

      <SettingsTemplate title={t(`Apps`)}>
        <ul className="flex flex-col gap-4">
          {APPS.map((app, index) => (
            <li
              className={`dark-text-title flex cursor-pointer items-center gap-2 p-2 text-[20px] hover:bg-zinc-500`}
              key={`${app.name + index}`}
              onDoubleClick={() => handleApps(app)}
            >
              <app.icon />
              {t(app.name)}
            </li>
          ))}
        </ul>
      </SettingsTemplate>
    </div>
  );
};
