import { readTextFile } from "@tauri-apps/api/fs";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LiaAngleDownSolid,
  LiaAngleUpSolid,
  LiaFile,
  LiaFolder,
  LiaFolderOpenSolid,
  LiaTrashAlt,
} from "react-icons/lia";
import { LuTextCursor } from "react-icons/lu";
import { v4 as uuidv4 } from "uuid";
import { ImageInput } from "../components/apps/settings/ImageInput";
import { Button } from "../components/common/Button";
import { globalColors } from "../data/data";
import { useClickOutside } from "../hooks/useClickOutside";
import { useOS } from "../hooks/useOS";
import { App } from "../interfaces/App.interface";
import { FileInfo } from "../interfaces/apps/FileExplorer.interface";
import { Color } from "../interfaces/context/Config.interface";
import useStore from "../store/useStore";
import { getFileIcon } from "../utils/getFileIcon";
import {
  create_directory,
  create_file,
  delete_directory,
  delete_file,
  list_all_files,
  rename_directory,
  rename_file,
} from "../utils/invoke";
import { MediaPlayerApp } from "./MediaPlayer";
import { NotepadApp } from "./Notepad";
import { PhotosApp } from "./Photos";

const FileExplorer = () => {
  const { currentUser } = useOS();

  const [currentPath, setCurrentPath] = useState<string>(currentUser.id);
  const [files, setFiles] = useState<FileInfo[] | undefined>();
  const [fileSelected, setFileSelected] = useState<FileInfo | undefined>();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSecondMenuOpen, setIsSecondMenuOpen] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("New File.txt");
  const [newFolderName, setNewFolderName] = useState<string>("New Folder");
  const [newName, setNewName] = useState<string>("");

  const { t } = useTranslation();

  const color = useStore((store) => store.config.color);

  const fetchFiles = async (path: string) => {
    try {
      const fileList = await list_all_files(path);
      setFiles(fileList);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  const closeSecondMenu = useCallback(() => {
    setIsSecondMenuOpen(false);
  }, []);

  useEffect(() => {
    fetchFiles(currentUser.id);
    setCurrentPath(currentUser.username);
  }, [currentUser.id]);

  const menuRef = useClickOutside(closeMenu);
  const menuRef1 = useClickOutside(closeSecondMenu);

  const addNumbertoMemory = useStore((store) => store.addNumbertoMemory);
  const openApp = useStore((store) => store.openApp);

  const handleDoubleClick = async (file: FileInfo) => {
    if (file.is_dir) {
      setCurrentPath(`${currentUser.username}/${file.name}`);
      fetchFiles(`${currentUser.id}/${file.name}`);
    } else {
      try {
        const filePath = `data/${getFullPath()}/${file.name}`;

        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        if (
          fileExtension === "png" ||
          fileExtension === "jpg" ||
          fileExtension === "jpeg"
        ) {
          // Abrir imágenes con PhotosApp
          const newWindowId = uuidv4();
          useStore.getState().openFile(newWindowId, file.name, filePath, null);
          openApp(PhotosApp, newWindowId);
          addNumbertoMemory(PhotosApp.memory);
          console.log(`Imagen cargada: ${filePath}`);
        } else if (fileExtension === "mp4" || fileExtension === "mp3") {
          // Abrir imágenes con PhotosApp
          const newWindowId = uuidv4();
          useStore.getState().openFile(newWindowId, file.name, filePath, null);
          openApp(MediaPlayerApp, newWindowId);
          addNumbertoMemory(MediaPlayerApp.memory);
          console.log(`Imagen cargada: ${filePath}`);
        } else {
          // Leer contenido del archivo de texto
          const fileContent = await readTextFile(filePath);

          const newWindowId = uuidv4();
          useStore
            .getState()
            .openFile(newWindowId, file.name, filePath, fileContent);

          openApp(NotepadApp, newWindowId);
          addNumbertoMemory(NotepadApp.memory);
          console.log(`Archivo cargado: ${filePath}`);
        }
      } catch (error) {
        console.error("Error al abrir el archivo:", error);
      }
    }
  };

  const getFullPath = (): string => {
    const pathSegments = currentPath.split("/");

    return [currentUser.id, ...pathSegments.slice(1)].join("/");
  };

  const goBack = () => {
    if (currentPath === currentUser.username) return;

    const pathSegments = currentPath.split("/");
    pathSegments.pop();

    const newPathForFetch = [currentUser.id, ...pathSegments.slice(1)].join(
      "/",
    );

    const newPathForDisplay = [
      currentUser.username,
      ...pathSegments.slice(1),
    ].join("/");

    setCurrentPath(newPathForDisplay);
    fetchFiles(newPathForFetch);
  };

  const createDirectory = async () => {
    try {
      const fullPath = `${getFullPath()}/${newFolderName}`;
      const result = await create_directory(fullPath);
      console.log(result);
      fetchFiles(getFullPath());
    } catch (error) {
      console.error("Error creating directory:", error);
    }
  };

  const createFile = async () => {
    try {
      const result = await create_file(getFullPath(), newFileName);
      console.log(result);
      fetchFiles(getFullPath());
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const handleOnClick = (file: FileInfo) => {
    setFileSelected(file);
  };

  const handleOnAuxClick = (file: FileInfo) => {
    if (currentPath !== currentUser.username) {
      setIsSecondMenuOpen(true);
      setNewName(file.name);
      setFileSelected(file);
    }
  };

  const handleRename = async () => {
    if (fileSelected) {
      if (fileSelected.is_dir) {
        try {
          const res = await rename_directory(
            getFullPath(),
            fileSelected.name,
            newName,
          );
          console.log(res);
          fetchFiles(getFullPath());
        } catch (error) {
          console.error("Error renaming directory:", error);
        }
      } else {
        try {
          const res = await rename_file(
            getFullPath(),
            fileSelected.name,
            newName,
          );
          console.log(res);
          fetchFiles(getFullPath());
        } catch (error) {
          console.error("Error renaming file:", error);
        }
      }
    }
  };

  const handleDelete = async () => {
    if (fileSelected) {
      const path = `${getFullPath()}/${fileSelected.name}`;
      if (fileSelected.is_dir) {
        try {
          const res = await delete_directory(path);
          console.log(res);
          fetchFiles(getFullPath());
        } catch (error) {
          console.error("Error deleting directory:", error);
        }
      } else {
        try {
          const res = await delete_file(path);

          console.log(res);
          fetchFiles(getFullPath());
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
    }
  };

  return (
    <div
      className="dark-bg-primary dark-text-normal h-full select-none px-4 py-2"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="dark-text-title relative flex h-[32px] items-center justify-between">
        {t("Path")}: {currentPath}
        {currentPath !== currentUser.username && (
          <Button onClick={() => setIsMenuOpen(!isMenuOpen)} noMarginTop>
            {isMenuOpen ? <LiaAngleUpSolid /> : <LiaAngleDownSolid />}
          </Button>
        )}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full z-50 flex min-w-[360px] flex-col gap-2 rounded-b-xl rounded-tl-xl bg-[#2f2f2f] p-2 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="flex-grow rounded bg-[#444] p-1"
                placeholder="New Folder Name"
              />
              <Button onClick={createDirectory} noMarginTop>
                <LiaFolder /> {t("Create folder")}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="flex-grow rounded bg-[#444] p-1"
                placeholder="New File Name"
              />
              <Button onClick={createFile} noMarginTop>
                <LiaFile /> {t("Create file")}
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ImageInput path={`data/${getFullPath()}`} />
            </div>
          </div>
        )}
      </div>

      <ul>
        {currentPath !== currentUser.username && (
          <li
            className="flex cursor-pointer items-center gap-1"
            onDoubleClick={goBack}
          >
            <LiaFolder /> ...
          </li>
        )}
        {files?.map((file) => (
          <li
            className={`relative flex cursor-pointer items-center gap-1 ${fileSelected?.name === file.name && `border ${globalColors.border[color as Color].base}`}`}
            key={file.name}
            onClick={() => handleOnClick(file)}
            onDoubleClick={() => handleDoubleClick(file)}
            onAuxClick={() => handleOnAuxClick(file)}
          >
            {getFileIcon(file)}
            {file.name}
            {isSecondMenuOpen && fileSelected?.name === file.name && (
              <div
                ref={menuRef1}
                className="absolute right-0 top-full z-50 flex min-w-[360px] flex-col gap-2 rounded-b-xl rounded-tl-xl bg-[#2f2f2f] p-2 shadow-lg"
              >
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-grow rounded bg-[#444] p-1"
                  placeholder="New Folder Name"
                />{" "}
                <Button onClick={handleRename} noMarginTop>
                  <LuTextCursor /> {t("Rename")}
                </Button>
                <Button onClick={handleDelete} noMarginTop>
                  <LiaTrashAlt /> {t("Delete")}{" "}
                  {fileSelected.is_dir ? t("folder") : t("file")}
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FileExplorerApp: App = {
  app: FileExplorer,
  icon: LiaFolderOpenSolid,
  isFullwindow: false,
  manyWindows: true,
  memory: 1,
  name: "FileExplorer",
  onClose: () => {},
};
