import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LiaEditSolid,
  LiaPlusSolid,
  LiaTrashSolid,
  LiaUser,
} from "react-icons/lia";
import { useOS } from "../../../../hooks/useOS";
import { User } from "../../../../interfaces/authentication/authentication.interface";
import useStore from "../../../../store/useStore";
import { delete_user, get_users } from "../../../../utils/invoke";
import { Button } from "../../../common/Button";
import { SettingsTemplate } from "../Settings.Template";
import { Account } from "./Account";

export const ListAccounts = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);

  const setAccountsOption = useStore((store) => store.setAccountsOption);

  const { currentUser } = useOS();

  const fetchAndSetUsers = useCallback(async () => {
    try {
      const res = await get_users();
      const users = res.filter(
        (user) => user.username !== currentUser.username,
      );
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  }, [currentUser.username]);

  useEffect(() => {
    fetchAndSetUsers();
  }, [fetchAndSetUsers]);

  const handleDeleteUser = async (id: string) => {
    try {
      await delete_user(id);
      await fetchAndSetUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SettingsTemplate title={t(`Accounts`)}>
      <div className="flex w-full justify-end">
        <Button onClick={() => setAccountsOption(Account)}>
          <LiaPlusSolid /> {t(`Add user`)}
        </Button>
      </div>

      <div className="flex w-full justify-center">
        <div className="overflow-hidden rounded-lg border border-zinc-800">
          <table className={`table-auto text-left`}>
            <thead>
              <tr className="bg-zinc-800 capitalize">
                <th className="px-2 py-4 text-center">{t(`image`)}</th>
                <th className="px-2 py-4">{t(`name`)}</th>
                <th className="px-2 py-4">{t(`role`)}</th>
                <th className="px-2 py-4 text-center">{t(`actions`)}</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user, index) => (
                  <tr
                    className={`${index % 2 === 1 ? "bg-zinc-800" : "dark-text-normal"} `}
                    key={user.id}
                  >
                    <td className="p-2">
                      <div className="flex items-center justify-center">
                        {user.photo !== "no_photo" ? (
                          <img
                            className="h-[48px] w-[48px] rounded-full"
                            src={`../../src-tauri/data/images/${user.photo}`}
                            alt="foto"
                          />
                        ) : (
                          <LiaUser className="h-[48px] w-[48px]" />
                        )}
                      </div>
                    </td>
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">
                      <div className="flex min-h-full items-center justify-center gap-2">
                        <Button
                          className="rounded-full"
                          onClick={() =>
                            setAccountsOption(Account, {
                              id: user.id,
                            })
                          }
                          noMarginTop
                        >
                          <LiaEditSolid className="text-[24px]" />
                        </Button>
                        <Button
                          className="rounded-full"
                          newColor="bg-red-700"
                          onClick={() => handleDeleteUser(user.id)}
                          noMarginTop
                        >
                          <LiaTrashSolid className="cursor-pointer text-[24px]" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </SettingsTemplate>
  );
};
