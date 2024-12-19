import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { globalColors, MenuItems } from "../../../data/data";
import { useOS } from "../../../hooks/useOS";
import useStore from "../../../store/useStore";
import { minimumTextSize } from "../../../utils/utils";
import { ProfilePhoto } from "../../common/ProfilePhoto";

export const SettingsMenu = () => {
  const windowState = useStore((store) =>
    Object.values(store.apps)
      .flatMap((instances) => instances)
      .find((window) => window.app.name === "Settings"),
  );

  if (!windowState) return null;

  const { t } = useTranslation();

  const color = useStore((store) => store.config.color);
  const setSettingsOption = useStore((store) => store.setSettingsOption);

  useEffect(() => {}, [windowState]);

  const { currentUser } = useOS();

  return (
    <div className="flex min-h-full flex-col">
      <div className="dark-bg-primary flex min-h-[214px] w-full flex-col items-center justify-center gap-2 rounded-b-3xl px-8 py-4 shadow-2xl">
        <ProfilePhoto mini />
        <h2 className="dark-text-title text-xl lg:text-2xl">
          {minimumTextSize(currentUser.username)}
        </h2>
      </div>

      <div
        className={`grid w-full gap-4 ${
          windowState.isFullWindow
            ? "grid-cols-3"
            : windowState.width < 700
              ? "grid-cols-1"
              : "grid-cols-3"
        } ${
          windowState.isFullWindow
            ? "p-8"
            : windowState.width < 700
              ? "p-4"
              : "p-8"
        }`}
      >
        {MenuItems.map(
          (item, index) =>
            (!item.toAdmin || currentUser.role === "admin") && (
              <div
                className={`dark-bg-primary dark-text-title flex rounded-sm border-2 border-zinc-100 dark:border-zinc-900 ${globalColors.border[color].darkHover} ${globalColors.text[color].darkHover}`}
                key={index}
                onClick={() => setSettingsOption(item.option)}
              >
                <item.Icon className="text-[48px]" />
                <p>{t(item.name)}</p>
              </div>
            ),
        )}
      </div>
    </div>
  );
};
