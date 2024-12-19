import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { saveImageLocally } from "../../../utils/utils";
import { Button } from "../../common/Button";
import { Input } from "../../common/Input";

export const ImageInput = ({ path }: { path?: string }) => {
  const { t } = useTranslation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(t("Please select a valid image file."));
        return;
      }
      setImageFile(file);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      alert(t("No image file selected."));
      return;
    }

    try {
      setUploading(true);
      const fileName = imageFile.name;
      const savedFilePath = await saveImageLocally(imageFile, fileName, path);

      if (savedFilePath) {
        alert(t("Image saved successfully."));
      } else {
        alert(t("Failed to save the image."));
      }
    } catch (error) {
      console.error("Error saving the image:", error);
      alert(t("An error occurred while saving the image."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Input
        placeholder={t(`Browse`)}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Button
        onClick={handleUpload}
        className={`${uploading ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={uploading}
      >
        {uploading ? t(`Uploading...`) : t(`Choose image`)}
      </Button>
    </div>
  );
};
