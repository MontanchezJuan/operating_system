import { useTranslation } from "react-i18next";
import { LiaHomeSolid } from "react-icons/lia";
import { globalColors, MenuItems } from "../../../data/data";
import { useOS } from "../../../hooks/useOS";
import useStore from "../../../store/useStore";

export const Submenu = () => {
  const { t } = useTranslation();

  const color = useStore((store) => store.config.color);
  const resetSettingsOption = useStore((store) => store.resetSettingsOption);
  const setSettingsOption = useStore((store) => store.setSettingsOption);
  const SettingsOption = useStore((store) => store.SettingsOption);

  const { currentUser } = useOS();

  return (
    <div className="dark-bg-secondary dark-text-title flex min-h-full min-w-[200px] flex-col items-center overflow-hidden py-10 hover:overflow-y-auto dark:overflow-hidden dark:hover:overflow-y-auto">
      <div
        className="mb-5 flex w-full items-center gap-2 px-4 py-2 text-[18px] hover:bg-zinc-400 dark:hover:bg-zinc-700"
        onClick={() => resetSettingsOption()}
      >
        <LiaHomeSolid className="text-[24px]" />
        <span>{t(`Home`)}</span>
      </div>
      {MenuItems.map(
        (item, index) =>
          (!item.toAdmin || currentUser.role === "admin") && (
            <div
              className="relative mb-5 flex w-full items-center gap-2 px-4 py-2 text-[18px] hover:bg-zinc-400 dark:hover:bg-zinc-700"
              key={index}
              onClick={() => setSettingsOption(item.option)}
            >
              {SettingsOption === item.option && (
                <div
                  className={`absolute left-0 top-[calc(50%_-_14px)] h-7 w-2 transition-colors duration-300 dark:top-[calc(50%_-_14px)] ${globalColors.bg[color].base} `}
                />
              )}
              <item.Icon className="text-[24px]" />
              <span>{t(item.name)}</span>
            </div>
          ),
      )}
    </div>
  );
};
