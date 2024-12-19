import { platform, type, version } from "@tauri-apps/api/os";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LiaCodeBranchSolid,
  LiaLaptopSolid,
  LiaServerSolid,
} from "react-icons/lia";
import { SettingsTemplate } from "../Settings.Template";
import { Submenu } from "../Submenu";

export const SystemItem = () => {
  const { t } = useTranslation();
  const [systemInfo, setSystemInfo] = useState({
    os: "",
    kernel: "",
    platform: "",
  });

  useEffect(() => {
    const fetchSystemInfo = async () => {
      const osName = await type();
      const kernelInfo = await version();
      const platformInfo = await platform();
      setSystemInfo({
        os: osName,
        kernel: kernelInfo,
        platform: platformInfo,
      });
    };

    fetchSystemInfo();
  }, []);

  return (
    <div className="flex h-full w-full">
      <Submenu />

      <SettingsTemplate title={t(`System`)}>
        <section className="flex flex-col gap-4">
          <h2 className="dark-text-title text-2xl font-medium">
            {t(`System Information`)}
          </h2>

          <ul className="dark-text-normal list-none space-y-4 pl-0">
            <li className="flex items-center gap-4">
              <LiaLaptopSolid className="text-xl text-blue-500" />
              <span>
                <strong>{t(`Operating system`)}:</strong> {systemInfo.os}
              </span>
            </li>
            <li className="flex items-center gap-4">
              <LiaCodeBranchSolid className="text-xl text-green-500" />
              <span>
                <strong>{t(`Kernel version`)}:</strong> {systemInfo.kernel}
              </span>
            </li>
            <li className="flex items-center gap-4">
              <LiaServerSolid className="text-xl text-orange-500" />
              <span>
                <strong>{t(`Operating system platform`)}:</strong>{" "}
                {systemInfo.platform}
              </span>
            </li>
          </ul>
        </section>
      </SettingsTemplate>
    </div>
  );
};
