import React from "react";
import { useTranslation } from "react-i18next";
import {
  LiaWindowCloseSolid,
  LiaWindowMaximizeSolid,
  LiaWindowMinimizeSolid,
  LiaWindowRestoreSolid,
} from "react-icons/lia";
import { useWindowManager } from "../hooks/useWindowManager";
import useStore from "../store/useStore";

interface PropsWindow {
  windowId: string;
  children: React.ReactNode;
  Icon: React.ElementType;
}

export const Window = ({ windowId, children, Icon }: PropsWindow) => {
  const { t } = useTranslation();
  const { handleDragStart, handleMouseDown, currentPosition, windowState } =
    useWindowManager(windowId);

  const subtractionNumbertoMemory = useStore(
    (store) => store.subtractionNumbertoMemory,
  );
  const closeApp = useStore((store) => store.closeApp);
  const focusApp = useStore((store) => store.focusApp);
  const minimizeApp = useStore((store) => store.minimizeApp);
  const setIsFullwindow = useStore((store) => store.setIsFullwindow);

  const handleClose = () => {
    closeApp(windowState.windowId);
    windowState.app.onClose();
    if ("memory" in windowState.app) {
      subtractionNumbertoMemory(windowState.app.memory);
    } else {
      alert("memory error :c");
    }
  };

  const handleRestoreToggle = () => {
    setIsFullwindow(windowId);
  };

  return (
    <div
      className={`absolute flex flex-col bg-zinc-900 ${windowState.isMinimized ? "hidden" : ""} ${windowState.isFocused ? "z-20" : "z-10"}`}
      style={{
        width: windowState.isFullWindow ? "100vw" : `${windowState.width}px`,
        height: windowState.isFullWindow
          ? "calc(100vh - 48px)"
          : `${windowState.height}px`,
        left: windowState.isFullWindow ? 0 : `${currentPosition.x}px`,
        top: windowState.isFullWindow ? 0 : `${currentPosition.y}px`,
      }}
      onClick={() => focusApp(windowState.windowId)}
    >
      <div
        className="dark-bg-secondary dark-text-title fixed flex cursor-pointer select-none justify-between text-[28px]"
        style={{
          width: windowState.isFullWindow ? "100vw" : `${windowState.width}px`,
        }}
        onDoubleClick={handleRestoreToggle}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2 px-1 text-[18px]">
          <Icon />
          <p className="text-[16px]">{t(windowState.app.name)}</p>
        </div>

        <div className="flex">
          <button
            className="cursor-pointer"
            onClick={() => minimizeApp(windowState.windowId)}
            aria-label="Minimize Window"
          >
            <LiaWindowMinimizeSolid />
          </button>
          <button
            className="cursor-pointer"
            onClick={handleRestoreToggle}
            aria-label={
              windowState.isFullWindow ? "Restore Window" : "Maximize Window"
            }
          >
            {windowState.isFullWindow ? (
              <LiaWindowRestoreSolid />
            ) : (
              <LiaWindowMaximizeSolid />
            )}
          </button>
          <button
            className="cursor-pointer text-red-600"
            onClick={handleClose}
            aria-label="Close Window"
          >
            <LiaWindowCloseSolid />
          </button>
        </div>
      </div>

      <div className="dark-bg-secondary mt-[28px] h-full w-full overflow-y-auto">
        {children}
      </div>

      {!windowState.isFullWindow && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize bg-gray-500"
          onMouseDown={handleMouseDown}
          aria-label="Resize Window"
        />
      )}
    </div>
  );
};
