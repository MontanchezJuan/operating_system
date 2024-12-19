import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LiaBarsSolid,
  LiaCogSolid,
  LiaOtterSolid,
  LiaSignOutAltSolid,
} from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { APPS } from "../../apps";
import { SettingsApp } from "../../apps/Settings";
import { useClickOutside } from "../../hooks/useClickOutside";
import { App } from "../../interfaces/App.interface";
import { PAGES } from "../../pages";
import useStore from "../../store/useStore";

export const MenuHome = () => {
  const { t } = useTranslation();

  const [isMenuHomeOpen, setIsMenuHomeOpen] = useState<boolean>(false);
  const [isMenuAppsOpen, setIsMenuAppsOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const addNumbertoMemory = useStore((store) => store.addNumbertoMemory);
  const openApp = useStore((store) => store.openApp);
  const signOut = useStore((store) => store.signOut);

  const closeMenu = useCallback(() => {
    setIsMenuAppsOpen(false);
    setIsMenuHomeOpen(false);
  }, []);

  const menuRef = useClickOutside(closeMenu);

  const handleApps = (app: App) => {
    openApp(app);
    addNumbertoMemory(app.memory);
    setIsMenuAppsOpen(false);
    setIsMenuHomeOpen(false);
  };

  const handleSignOut = () => {
    navigate(PAGES[0].path, { replace: true });
    signOut();
    useStore.getState().resetSettingsOption();
    useStore.getState().resetAccountsOption();
    useStore.getState().resetTaskManagerOption();
  };

  return (
    <>
      {isMenuHomeOpen ? (
        <div
          ref={menuRef}
          className="dark-bg-secondary dark-text-normal absolute bottom-[48px] left-0 z-40 flex h-[66vh] w-[320px]"
        >
          <div className="flex flex-col justify-between p-2">
            <LiaBarsSolid onClick={() => setIsMenuAppsOpen(!isMenuAppsOpen)} />

            <div className="flex flex-col gap-2">
              <LiaCogSolid onClick={() => handleApps(SettingsApp)} />
              <LiaSignOutAltSolid onClick={() => handleSignOut()} />
            </div>
          </div>

          {isMenuAppsOpen && (
            <div className="dark-bg-primary flex min-h-full w-full flex-col overflow-y-auto">
              {APPS.map((app, index) => (
                <button
                  className="dark-bg-primary dark-text-title flex w-full items-center gap-2 p-2 text-[20px] hover:bg-zinc-500"
                  onClick={() => handleApps(app)}
                  key={`${app.name + index}`}
                >
                  <app.icon /> <p>{t(app.name)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}

      <div className="p-2">
        {isMenuHomeOpen ? (
          <LiaOtterSolid
            className="text-zinc-500"
            onClick={() => setIsMenuHomeOpen(false)}
          />
        ) : (
          <LiaOtterSolid onClick={() => setIsMenuHomeOpen(true)} />
        )}
      </div>
    </>
  );
};
