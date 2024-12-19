import { LiaImageSolid } from "react-icons/lia";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/common/Button";
import { ListFiles } from "../components/common/ListFiles";
import { useOS } from "../hooks/useOS";
import { App } from "../interfaces/App.interface";
import useStore from "../store/useStore";

const Photos = ({ windowId }: { windowId: string }) => {
  const { t } = useTranslation();
  const { currentUser } = useOS();

  const [imageSrc, setImageSrc] = useState<string>("");

  const fileInstance = useStore((store) =>
    store.fileInstances.find((instance) => instance.windowId === windowId),
  );

  useEffect(() => {
    if (fileInstance) {
      setImageSrc(fileInstance.filePath);
    }
  }, [fileInstance]);

  return imageSrc ? (
    <div className="dark-bg-primary relative flex h-full w-full items-center justify-center">
      <Button
        onClick={() => setImageSrc("")}
        className="absolute left-2 top-2"
        noMarginTop
      >
        <LiaImageSolid />
        {t("View photos")}
      </Button>
      <img
        src={`../../src-tauri/${imageSrc}`}
        alt="Preview"
        className="h-full w-full"
      />
    </div>
  ) : (
    <div className="dark-bg-primary dark-text-normal h-full px-4 py-2">
      <ListFiles path={`${currentUser.id}/Pictures`} title={t("Photos")} />
    </div>
  );
};

export const PhotosApp: App = {
  app: Photos,
  icon: LiaImageSolid,
  isFullwindow: false,
  manyWindows: false,
  memory: 1,
  name: "Photos",
  onClose: () => {},
};
