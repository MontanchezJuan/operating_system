import { useTranslation } from "react-i18next";
import { FaCheck, FaMoon, FaSun } from "react-icons/fa";
import { globalColors } from "../../../../data/data";
import { useOS } from "../../../../hooks/useOS";
import { Color, Type } from "../../../../interfaces/context/Config.interface";
import useStore from "../../../../store/useStore";
import { update_config } from "../../../../utils/invoke";
import { Button } from "../../../common/Button";
import { SettingsTemplate } from "../Settings.Template";
import { Submenu } from "../Submenu";

export const PersonalizationItem = () => {
  const { t } = useTranslation();

  const windowState = useStore((store) =>
    Object.values(store.apps)
      .flat()
      .find((app) => app.app.name === "Settings"),
  );

  if (!windowState) return null;

  const { currentUser } = useOS();

  const colorSwitch = useStore((store) => store.colorSwitch);
  const config = useStore((store) => store.config);
  const globalColor = useStore((store) => store.config.color);
  const isDarkMode = useStore((store) => store.config.is_dark_mode);
  const themeSwitch = useStore((store) => store.themeSwitch);

  const handleMode = async () => {
    const res = await update_config(
      currentUser.id,
      String(!isDarkMode),
      config.color,
      config.language,
    );
    if (res) {
      themeSwitch(!isDarkMode);
    }
  };

  const handleColor = async (color: Color) => {
    const res = await update_config(
      currentUser.id,
      String(config.is_dark_mode),
      color,
      config.language,
    );
    if (res) {
      colorSwitch(color);
    }
  };

  return (
    <div className="flex h-full w-full">
      <Submenu />

      <SettingsTemplate title={t(`Personalization`)}>
        <section className="flex flex-col gap-4">
          <h2 className="dark-text-title text-2xl font-medium">
            {t(`Colors`)}
          </h2>
          <p className="dark-text-normal">{t(`Choose your color mode`)}</p>
          <Button onClick={() => handleMode()}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
            {isDarkMode ? t(`Switch to Light Mode`) : t(`Switch to Dark Mode`)}
          </Button>
          <p className="dark-text-normal">{t(`Choose your accent color`)}</p>
          <div
            className={`grid gap-1 ${
              windowState.width > 800 || windowState.isFullWindow
                ? "grid-cols-6"
                : "grid-cols-3"
            }`}
          >
            {Object.keys(globalColors).map((instance, index) => {
              if (index !== 0) return null;

              const colorInstances = globalColors[instance as Type];
              return Object.keys(colorInstances).map((color) => (
                <div
                  key={color}
                  className={`relative h-20 w-20 cursor-pointer ${globalColors.bg[color as Color].base} `}
                  onClick={() => handleColor(color as Color)}
                >
                  {globalColor === color && (
                    <FaCheck className="absolute right-1 top-1 h-6 w-6 rounded-full bg-gray-600 p-1 dark:bg-gray-500" />
                  )}
                </div>
              ));
            })}
          </div>
        </section>
      </SettingsTemplate>
    </div>
  );
};
