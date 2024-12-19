import { invoke } from "@tauri-apps/api";

import { FileInfo } from "../interfaces/apps/FileExplorer.interface";
import { User } from "../interfaces/authentication/authentication.interface";
import { Config } from "../store/createConfigsSlice";

export const get_users = () => invoke<User[]>("get_users");

export const get_user_by_id = (id: string) =>
  invoke<User>("get_user_by_id", { id });

export const update_last_user = (id: string) =>
  invoke("update_last_user", {
    id,
  });

export const register_user = (
  id: string,
  username: string,
  password: string,
  role: string,
  photoPath: string | null,
  backgroundPath: string | null,
) =>
  invoke("register_user", {
    id,
    username,
    password,
    role,
    photoPath,
    backgroundPath,
  });

export interface UPDATE_USER {
  id: string;
  newUsername?: string;
  newPassword?: string;
  newRole?: string;
  newPhotoPath?: string | undefined;
  newBackgroundPath?: string | undefined;
}

export const update_user = ({
  id,
  newUsername,
  newPassword,
  newRole,
  newPhotoPath,
  newBackgroundPath,
}: UPDATE_USER) =>
  invoke("update_user", {
    id,
    newUsername,
    newPassword,
    newRole,
    newPhotoPath,
    newBackgroundPath,
  });

export const get_config = (id: string) => invoke<Config>("get_config", { id });

export const update_config = (
  id: string,
  newIsDarkMode: string,
  newColor: string,
  newLanguage: string,
) => invoke("update_config", { id, newIsDarkMode, newColor, newLanguage });

export const get_last_user = () => invoke<User>("get_last_user");

export const login = (username: string, password: string) =>
  invoke<string>("login", {
    username,
    password,
  });

export const delete_user = (id: string) =>
  invoke<string>("delete_user", { id });

export const list_directories = (id: string) =>
  invoke<string[]>("list_directories", { id });

export const create_directory = (path: string) =>
  invoke<string>("create_directory", {
    path,
  });

export const rename_directory = (
  path: string,
  oldName: string,
  newName: string,
) => invoke("rename_directory", { path, oldName, newName });

export const delete_directory = (path: string) =>
  invoke("delete_directory", { path });

export const create_file = (path: string, filename: string) =>
  invoke<string>("create_file", { path, filename });

export const rename_file = (path: string, oldName: string, newName: string) =>
  invoke<string>("rename_file", { path, oldName, newName });

export const delete_file = (path: string) =>
  invoke<string>("delete_file", { path });

export const list_all_files = (basePath: string) =>
  invoke<FileInfo[]>("list_all_files", { basePath });
