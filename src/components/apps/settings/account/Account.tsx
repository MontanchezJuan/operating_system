import { useTranslation } from "react-i18next";
import { LiaArrowLeftSolid } from "react-icons/lia";
import useStore from "../../../../store/useStore";
import { Button } from "../../../common/Button";
import { FormAccount } from "../../../form/FormAccount";
import { SettingsTemplate } from "../Settings.Template";
import { ListAccounts } from "./ListAccounts";

interface AccountProps {
  id?: string;
}

export const Account = ({ id }: AccountProps) => {
  const { t } = useTranslation();
  const setAccountsOption = useStore((store) => store.setAccountsOption);

  return (
    <SettingsTemplate title={t(`Create account`)}>
      <div className="flex w-full">
        <Button onClick={() => setAccountsOption(ListAccounts)}>
          <LiaArrowLeftSolid /> {t(`Back`)}
        </Button>
      </div>

      <div className="flex w-full justify-center">
        <FormAccount
          id={id}
          lastUpdate={() => {
            setAccountsOption(ListAccounts);
          }}
        />
      </div>
    </SettingsTemplate>
  );
};
