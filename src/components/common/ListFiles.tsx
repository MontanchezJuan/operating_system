import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { MediaPlayerApp } from "../../apps/MediaPlayer";
import { PhotosApp } from "../../apps/Photos";
import { FileInfo } from "../../interfaces/apps/FileExplorer.interface";
import useStore from "../../store/useStore";
import { getFileIcon } from "../../utils/getFileIcon";
import { list_all_files } from "../../utils/invoke";

interface ListFilesProps {
  path: string;
  title: string;
}

export const ListFiles = ({ path, title }: ListFilesProps) => {
  const { t } = useTranslation();

  const [files, setFiles] = useState<FileInfo[] | undefined>();

  const fetchFiles = async (path: string) => {
    try {
      const fileList = await list_all_files(path);
      setFiles(fileList);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles(path);
  }, [path]);

  const handleDoubleClick = async (file: FileInfo) => {
    if (file.is_dir) {
      alert(t(`Here you can not open a folder`));
    } else {
      try {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        if (
          fileExtension === "png" ||
          fileExtension === "jpg" ||
          fileExtension === "jpeg"
        ) {
          // Abrir imágenes con PhotosApp
          const newWindowId = uuidv4();
          useStore
            .getState()
            .openFile(
              newWindowId,
              file.name,
              `data/${path}/${file.name}`,
              null,
            );
          useStore.getState().openApp(PhotosApp, newWindowId);
          console.log(`Imagen cargada: ${path}/${file.name}`);
        } else if (fileExtension === "mp4" || fileExtension === "mp3") {
          // Abrir imágenes con PhotosApp
          const newWindowId = uuidv4();
          useStore
            .getState()
            .openFile(
              newWindowId,
              file.name,
              `data/${path}/${file.name}`,
              null,
            );
          useStore.getState().openApp(MediaPlayerApp, newWindowId);
          console.log(`Imagen cargada: ${path}/${file.name}`);
        }
      } catch (error) {
        console.error("Error al abrir el archivo:", error);
      }
    }
  };

  return (
    <ul>
      <li className={`dark-text-title flex cursor-pointer items-center gap-1`}>
        {t("Your")} {title}
      </li>
      {files?.map((file) => (
        <li
          className={`flex cursor-pointer items-center gap-1`}
          key={file.name}
          onDoubleClick={() => handleDoubleClick(file)}
        >
          {getFileIcon(file)}
          {file.name}
        </li>
      ))}
    </ul>
  );
};
