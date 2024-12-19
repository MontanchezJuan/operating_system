import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LiaImages } from "react-icons/lia";
import { App } from "../interfaces/App.interface";

const API = () => {
  const { t } = useTranslation();

  const [images, setImages] = useState<
    { id: string; author: string; download_url: string }[]
  >([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("https://picsum.photos/v2/list");
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="dark-bg-primary h-full w-full p-4">
      <h1 className="dark-text-title mb-4 text-2xl font-bold">
        Picsum Gallery
      </h1>

      <p className="dark-text-normal mb-6">
        {t("Explore random placeholder")}
        <a
          href="https://picsum.photos/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Picsum.photos
        </a>
        .
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="overflow-hidden rounded shadow-md">
            <img
              src={image.download_url}
              alt={image.author}
              className="h-48 w-full object-cover"
            />
            <div className="dark-bg-secondary p-2">
              <p className="dark-text-normal text-sm">
                {t("Author")}: {image.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const APIApp: App = {
  app: API,
  icon: LiaImages,
  isFullwindow: true,
  manyWindows: false,
  memory: 1,
  name: "API",
  onClose: () => {},
};
