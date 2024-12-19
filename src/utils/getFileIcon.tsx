import {
  LiaFile,
  LiaFileAlt,
  LiaFileAudio,
  LiaFileImage,
  LiaFilePdf,
  LiaFileVideo,
  LiaFolder,
} from "react-icons/lia";
import { FileInfo } from "../interfaces/apps/FileExplorer.interface";

export const getFileIcon = (file: FileInfo) => {
  if (file.is_dir) return <LiaFolder />;

  switch (file.extension?.toLowerCase()) {
    case "txt":
      return <LiaFileAlt />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <LiaFileImage />;
    case "mp3":
    case "wav":
      return <LiaFileAudio />;
    case "mp4":
    case "mkv":
    case "avi":
      return <LiaFileVideo />;
    case "pdf":
      return <LiaFilePdf />;
    default:
      return <LiaFile />;
  }
};
