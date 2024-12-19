import { useTranslation } from "react-i18next";
import { useOS } from "../../../../hooks/useOS";
import useStore from "../../../../store/useStore";
import { update_config } from "../../../../utils/invoke";
import { Button, ButtonBorder } from "../../../common/Button";
import { SettingsTemplate } from "../Settings.Template";
import { Submenu } from "../Submenu";

export const LanguageItem = () => {
  const { t, i18n } = useTranslation();

  const { currentUser } = useOS();

  const setLanguage = useStore((store) => store.setLanguage);
  const config = useStore((store) => store.config);

  const changeLanguage = async (lang: "en" | "es") => {
    const res = await update_config(
      currentUser.id,
      String(config.is_dark_mode),
      config.color,
      lang,
    );
    if (res) {
      i18n.changeLanguage(lang);
      setLanguage(lang);
    }
  };

  return (
    <div className="flex h-full w-full">
      <Submenu />

      <SettingsTemplate title={t(`Language`)}>
        <section className="flex flex-col gap-4">
          <h2 className="dark-text-title text-2xl font-medium">
            {t(`Display language`)}
          </h2>
          <p className="dark-text-normal">
            {t(`Apps will appear in this language`)}
          </p>
          {i18n.language === "en" ? (
            <>
              <Button onClick={() => changeLanguage("en")}>
                {t(`English`)}
              </Button>
              <ButtonBorder onClick={() => changeLanguage("es")}>
                {t(`Spanish`)}
              </ButtonBorder>
            </>
          ) : (
            <>
              <ButtonBorder onClick={() => changeLanguage("en")}>
                {t(`English`)}
              </ButtonBorder>
              <Button onClick={() => changeLanguage("es")}>
                {t(`Spanish`)}
              </Button>
            </>
          )}
        </section>
      </SettingsTemplate>
    </div>
  );
};
