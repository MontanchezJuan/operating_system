export interface App {
  app: React.ElementType;
  icon: React.ElementType;
  isFullwindow: boolean;
  manyWindows: boolean;
  memory: number;
  name: string;
  onClose: () => void;
}

export interface WindowState {
  app: App;
  height: number;
  isFocused: boolean;
  isFullWindow: boolean;
  isMinimized: boolean;
  width: number;
  windowId: string;
}
