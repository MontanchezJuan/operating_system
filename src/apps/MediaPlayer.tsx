import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LiaFilmSolid } from "react-icons/lia";
import { Button } from "../components/common/Button";
import { ListFiles } from "../components/common/ListFiles";
import { useOS } from "../hooks/useOS";
import { App } from "../interfaces/App.interface";
import useStore from "../store/useStore";

const MediaPlayer = ({ windowId }: { windowId: string }) => {
  const { t } = useTranslation();
  const { currentUser } = useOS();

  const [mediaSrc, setMediaSrc] = useState<string>("");
  const [mediaType, setMediaType] = useState<"audio" | "video">("video");

  const fileInstance = useStore((store) =>
    store.fileInstances.find((instance) => instance.windowId === windowId),
  );

  useEffect(() => {
    if (fileInstance) {
      const { filePath } = fileInstance;
      setMediaSrc(filePath);

      // Detección del tipo de archivo basándote en la extensión
      const extension = filePath.split(".").pop()?.toLowerCase();
      if (["mp3", "wav", "aac", "flac"].includes(extension!)) {
        setMediaType("audio");
      } else if (["mp4", "webm", "ogg", "mkv"].includes(extension!)) {
        setMediaType("video");
      }
    }
  }, [fileInstance]);

  return mediaSrc ? (
    <div className="dark-bg-primary relative flex h-full w-full items-center justify-center">
      {mediaType === "video" ? (
        <video
          src={`../../src-tauri/${mediaSrc}`}
          controls
          className="max-h-full max-w-full"
        />
      ) : (
        <audio
          src={`../../src-tauri/${mediaSrc}`}
          controls
          className="w-full max-w-lg"
        />
      )}
      <Button
        onClick={() => setMediaSrc("")}
        className="absolute left-2 top-2"
        noMarginTop
      >
        <LiaFilmSolid />
        {t("View videos")}
      </Button>
    </div>
  ) : (
    <div className="dark-bg-primary dark-text-normal h-full px-4 py-2">
      <ListFiles path={`${currentUser.id}/Videos`} title={t("Videos")} />
      <ListFiles path={`${currentUser.id}/Music`} title={t("Music")} />
    </div>
  );
};

export const MediaPlayerApp: App = {
  app: MediaPlayer,
  icon: LiaFilmSolid,
  isFullwindow: true,
  manyWindows: false,
  memory: 1,
  name: "MediaPlayer",
  onClose: () => {},
};
