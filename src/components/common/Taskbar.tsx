import { useEffect, useState } from "react";
import useStore from "../../store/useStore";
import Clock from "./Clock";
import { MenuHome } from "./MenuHome";

export const Taskbar = () => {
  const apps = useStore((store) => store.apps);
  const currentApp = useStore((store) => store.currentApp);
  const restoreApp = useStore((store) => store.restoreApp);
  const minimizeApp = useStore((store) => store.minimizeApp);
  const changeCurrentApp = useStore((store) => store.changeCurrentApp);

  const [showInstances, setShowInstances] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleMouseEnter = (appName: string, instancesLength: number) => {
    if (instancesLength > 1) {
      const timeout = setTimeout(() => {
        setShowInstances(appName);
      }, 500);
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setShowInstances(null);
  };

  useEffect(() => {}, [currentApp]);

  return (
    <div className="absolute bottom-0 flex w-screen bg-black text-[32px]">
      <MenuHome />

      {apps &&
        Object.keys(apps).map((appName, index) => {
          const appInstances = apps[appName];
          const Icon = appInstances[0].app.icon;
          const hasMultipleInstances = appInstances.length > 1;

          if (hasMultipleInstances) {
            return (
              <div
                key={`${appInstances.length + index}`}
                className="relative"
                onMouseEnter={() =>
                  handleMouseEnter(appName, appInstances.length)
                }
                onMouseLeave={handleMouseLeave}
              >
                {showInstances === appName && hasMultipleInstances && (
                  <div className="absolute bottom-[48px] z-30 flex rounded bg-gray-800 p-2 text-[12px] text-white shadow-lg">
                    {appInstances.map((instance, idx) => (
                      <button
                        key={instance.windowId}
                        className={`cursor-pointer p-1 ${
                          instance.isFocused ? "bg-zinc-600" : "bg-transparent"
                        }`}
                        onClick={() => {
                          restoreApp(instance.windowId);
                          setShowInstances(null);
                        }}
                      >
                        <p>
                          {instance.app.name} - {idx + 1}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                <button
                  className={`p-2 ${
                    appInstances.some((instance) => instance === currentApp) &&
                    "bg-zinc-600"
                  }`}
                  onClick={() => setShowInstances(appName)}
                >
                  <Icon />
                </button>
              </div>
            );
          }

          return (
            <button
              className={`p-2 ${
                appInstances.some((instance) => instance === currentApp)
                  ? "bg-zinc-600"
                  : "bg-black"
              }`}
              onClick={() => {
                const instance = appInstances[0];
                instance.isMinimized
                  ? restoreApp(instance.windowId)
                  : minimizeApp(instance.windowId);
              }}
              key={`${appInstances.length + index}`}
            >
              <Icon />
            </button>
          );
        })}

      <div
        className="min-h-full flex-grow"
        onClick={() => changeCurrentApp()}
      />

      <Clock />

      <div
        className="min-h-full w-[10px] border-l border-l-gray-400"
        onClick={() => changeCurrentApp()}
      />
    </div>
  );
};
