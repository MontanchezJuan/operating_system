import { useTranslation } from "react-i18next";
import { useOS } from "../../../../hooks/useOS";
import { FormAccount } from "../../../form/FormAccount";
import { SettingsTemplate } from "../Settings.Template";
import { Submenu } from "../Submenu";

export const MyAccountItem = () => {
  const { t } = useTranslation();

  const { currentUser } = useOS();

  return (
    <div className="flex h-full w-full">
      <Submenu />

      <SettingsTemplate title={t(`MyAccount`)}>
        <FormAccount
          id={currentUser.id}
          buttonText={t("Update account")}
          lastUpdate={() => {}}
        />
      </SettingsTemplate>
    </div>
  );
};
