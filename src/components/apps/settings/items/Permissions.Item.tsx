import { useTranslation } from "react-i18next";
import { LiaCheckCircle, LiaTimesCircle } from "react-icons/lia";
import { SettingsTemplate } from "../Settings.Template";
import { Submenu } from "../Submenu";

export const PermissionsItem = () => {
  const { t } = useTranslation();

  const permissions = [
    "Access dashboard",
    "Manage users",
    "Edit settings",
    "View permissions",
  ];

  const roles = {
    admin: [true, true, true, true],
    user: [true, false, true, false],
  };

  return (
    <div className="flex h-full w-full">
      <Submenu />

      <SettingsTemplate title={t(`Permissions`)}>
        <section className="flex flex-col gap-4">
          <h2 className="dark-text-title text-2xl font-medium">
            {t(`Roles and permissions`)}
          </h2>

          <p className="dark-text-normal">{t(`In this section,`)}</p>

          <div className="flex w-full justify-center">
            <div className="overflow-hidden rounded-lg border border-zinc-800">
              <table className={`table-auto text-left`}>
                <thead>
                  <tr className="bg-zinc-800 capitalize">
                    <th className="px-4 py-4">{t(`Permission`)}</th>
                    <th className="px-4 py-4">{t(`Admin`)}</th>
                    <th className="px-4 py-4">{t(`User`)}</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 1 ? "bg-zinc-800" : "dark-text-normal"
                      }`}
                    >
                      <td className="p-4">{t(permission)}</td>
                      <td className="p-4 text-center">
                        {roles.admin[index] ? (
                          <LiaCheckCircle className="text-green-500" />
                        ) : (
                          <LiaTimesCircle className="text-red-500" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {roles.user[index] ? (
                          <LiaCheckCircle className="text-green-500" />
                        ) : (
                          <LiaTimesCircle className="text-red-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </SettingsTemplate>
    </div>
  );
};
