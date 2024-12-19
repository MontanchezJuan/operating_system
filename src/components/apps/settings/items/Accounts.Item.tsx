import useStore from "../../../../store/useStore";
import { Submenu } from "../Submenu";

export const AccountsItem = () => {
  const AccountsOption = useStore((store) => store.AccountsOption);
  const AccountsProps = useStore((store) => store.AccountsProps);

  return (
    <div className="flex h-full w-full">
      <Submenu />

      <AccountsOption {...AccountsProps} />
    </div>
  );
};
