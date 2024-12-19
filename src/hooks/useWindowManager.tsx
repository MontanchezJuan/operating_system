import { useEffect, useState } from "react";
import useStore from "../store/useStore";

export const useWindowManager = (windowId: string) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  const resizeApp = useStore((store) => store.resizeApp);

  const windowState = useStore((store) =>
    Object.values(store.apps)
      .flatMap((appInstances) => appInstances)
      .find((window) => window.windowId === windowId),
  );

  if (!windowState) {
    return {
      handleDragStart: () => {},
      handleMouseDown: () => {},
      currentPosition: { x: 0, y: 0 },
      windowState: {
        width: 0,
        height: 0,
        windowId: "",
        app: {
          name: "",
          memory: 0,
          isFullwindow: false,
          manyWindows: false,
          onClose: () => {},
        },
        isFocused: false,
        isMinimized: false,
        isFullWindow: false,
      },
    };
  }

  const handleDragStart = (e: React.MouseEvent) => {
    if (!windowState.isFullWindow) {
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - currentPosition.x,
        y: e.clientY - currentPosition.y,
      });
    }
  };

  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - startPosition.x;
      const newY = e.clientY - startPosition.y;
      const maxWidth = window.innerWidth - windowState.width;
      const maxHeight = window.innerHeight - windowState.height - 48;
      setCurrentPosition({
        x: Math.min(Math.max(newX, 0), maxWidth),
        y: Math.min(Math.max(newY, 0), maxHeight),
      });
    }
  };

  const handleDragEnd = () => setIsDragging(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!windowState.isFullWindow) {
      setIsResizing(true);
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const deltaX = e.clientX - startPosition.x;
      const deltaY = e.clientY - startPosition.y;
      const newWidth = windowState.width + deltaX;
      const newHeight = windowState.height + deltaY;
      const maxWidth = window.innerWidth - currentPosition.x;
      const maxHeight = window.innerHeight - currentPosition.y - 48;
      resizeApp(
        windowState.windowId,
        Math.min(Math.max(newWidth, 520), maxWidth),
        Math.min(Math.max(newHeight, 360), maxHeight),
      );
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsResizing(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    } else if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing]);

  return {
    handleDragStart,
    handleMouseDown,
    currentPosition,
    windowState,
  };
};
