import { Editor } from "@monaco-editor/react";
import { writeFile } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LiaFileAltSolid, LiaSave } from "react-icons/lia";
import { Button } from "../components/common/Button";
import { useOS } from "../hooks/useOS";
import { App } from "../interfaces/App.interface";
import useStore from "../store/useStore";

const Notepad = ({ windowId }: { windowId: string }) => {
  const { t } = useTranslation();

  const { currentUser } = useOS();
  const is_dark_mode = useStore((store) => store.config.is_dark_mode);

  const fileInstance = useStore((store) =>
    store.fileInstances.find((instance) => instance.windowId === windowId),
  );

  const [editorContent, setEditorContent] = useState(
    fileInstance?.fileContent || "",
  );
  const [nameFile, setNameFile] = useState<string>(
    fileInstance?.fileName || "",
  );

  useEffect(() => {
    if (fileInstance) {
      setEditorContent(fileInstance.fileContent || "");
    }
  }, [fileInstance]);

  const handleSave = async () => {
    try {
      if (!fileInstance) {
        // Solicitar al usuario un nombre de archivo si no existe una instancia
        if (!nameFile) {
          alert(t("Debe ingresar un nombre para el archivo."));
          return;
        }

        const pathtoSave = `data/${currentUser.id}/Documents/${nameFile}`;

        // Guardar el archivo en el path especificado
        await writeFile({
          path: pathtoSave,
          contents: editorContent,
        });

        alert(`Archivo creado y guardado exitosamente en: ${pathtoSave}`);
      } else {
        // Si el archivo ya existe, simplemente sobrescribir
        await writeFile({
          path: fileInstance.filePath,
          contents: editorContent,
        });

        alert(`Archivo guardado exitosamente: ${fileInstance.filePath}`);
      }
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
      alert("Error al guardar el archivo.");
    }
  };

  return (
    <div className="dark-bg-primary flex flex-col gap-4">
      <div className="flex items-center gap-2 p-4">
        <input
          type="text"
          value={nameFile}
          disabled={!!fileInstance}
          className="rounded border p-2 text-black"
          onChange={(e) => setNameFile(e.target.value)}
        />
        <Button onClick={handleSave} noMarginTop>
          <LiaSave /> {t("Save")}
        </Button>
      </div>
      <Editor
        height="80vh"
        defaultLanguage="plaintext"
        value={editorContent}
        onChange={(value) => setEditorContent(value || "")}
        theme={is_dark_mode ? "vs-dark" : "vs-light"}
      />
    </div>
  );
};

export const NotepadApp: App = {
  app: Notepad,
  icon: LiaFileAltSolid,
  isFullwindow: false,
  manyWindows: true,
  memory: 1,
  name: "Notepad",
  onClose: () => {},
};
