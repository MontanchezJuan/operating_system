import { App } from "../interfaces/App.interface";
import { APIApp } from "./API";
import { CalculatorApp } from "./Calculator";
import { FileExplorerApp } from "./FileExplorer";
import { MediaPlayerApp } from "./MediaPlayer";
import { NotepadApp } from "./Notepad";
import { PhotosApp } from "./Photos";
import { SettingsApp } from "./Settings";
import { TaskManagerApp } from "./TaskManager";

export const APPS: App[] = [
  APIApp,
  CalculatorApp,
  FileExplorerApp,
  MediaPlayerApp,
  NotepadApp,
  PhotosApp,
  SettingsApp,
  TaskManagerApp,
];
