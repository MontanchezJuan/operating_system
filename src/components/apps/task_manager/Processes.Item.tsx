import { useTranslation } from "react-i18next";
import { LiaTrashAlt } from "react-icons/lia";
import useStore from "../../../store/useStore";
import { Button } from "../../common/Button";

export const ProcessesItem = () => {
  const { t } = useTranslation();

  const apps = useStore((store) => store.apps);
  const closeApp = useStore((store) => store.closeApp);
  const subtractionNumbertoMemory = useStore(
    (store) => store.subtractionNumbertoMemory,
  );

  const getWindowState = (windowId: string) => {
    return Object.values(apps)
      .flatMap((appInstances) => appInstances)
      .find((window) => window.windowId === windowId);
  };

  const handleClose = (windowId: string) => {
    if (windowId) {
      const windowState = getWindowState(windowId);
      if (windowState) {
        closeApp(windowState.windowId);
        windowState.app.onClose();
        if ("memory" in windowState.app) {
          subtractionNumbertoMemory(windowState.app.memory);
        } else {
          alert("memory error :c");
        }
      }
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-600">
      <table className={`table-auto`}>
        <thead>
          <tr>
            <th className="px-2 py-1 text-left capitalize">{t("name")}</th>
            <th className="px-2 py-1">CPU</th>
            <th className="px-2 py-1 text-left">{t("Memory")}</th>
          </tr>
        </thead>
        <tbody>
          {apps &&
            Object.keys(apps).map((appName) => {
              const appInstances = apps[appName];
              return appInstances.map((instance) => {
                return (
                  <tr key={instance.windowId} className="hover:bg-zinc-400">
                    <td className="flex h-full items-center gap-1 px-2 py-1 text-center">
                      <instance.app.icon />
                      {t(instance.app.name)}
                    </td>
                    <td className="px-2 py-1 text-center">
                      {Math.min(
                        4,
                        Math.max(
                          1,
                          Math.floor(
                            (Math.random() * instance.app.memory) / 100,
                          ),
                        ),
                      )}
                    </td>
                    <td className="px-2 py-1">{instance.app.memory / 100}</td>
                    <td className="px-2 py-1">
                      <Button
                        onClick={() => handleClose(instance.windowId)}
                        noMarginTop
                      >
                        <LiaTrashAlt /> {t("Delete process")}
                      </Button>
                    </td>
                  </tr>
                );
              });
            })}
        </tbody>
      </table>
    </div>
  );
};
