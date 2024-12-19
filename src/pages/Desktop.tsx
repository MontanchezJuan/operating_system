import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Background } from "../components/common/Background";
// import { Loader } from "../components/common/Loader";
import { Taskbar } from "../components/common/Taskbar";
import { useOS } from "../hooks/useOS";
import { Window } from "../layouts/Window";
import useStore from "../store/useStore";
import { get_config } from "../utils/invoke";

export const Desktop = () => {
  // const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  const { i18n } = useTranslation();

  const { currentUser } = useOS();

  const setConfig = useStore((store) => store.setConfig);
  const apps = useStore((store) => store.apps);

  const getConfig = async () => {
    const res = await get_config(currentUser.id);
    console.log(res);

    setConfig(res);
    i18n.changeLanguage(res.language);
  };

  useEffect(() => {
    getConfig();
  }, [currentUser]);

  return (
    <main className="relative h-screen w-screen">
      {/* <Loader isLoading={isPageLoading} /> */}

      <Background />

      {apps &&
        Object.keys(apps).map((appName) => {
          const appInstances = apps[appName];
          return appInstances.map((instance) => {
            return (
              <Window
                key={instance.windowId}
                windowId={instance.windowId}
                Icon={instance.app.icon}
              >
                <instance.app.app windowId={instance.windowId} />
              </Window>
            );
          });
        })}

      <Taskbar />
    </main>
  );
};
