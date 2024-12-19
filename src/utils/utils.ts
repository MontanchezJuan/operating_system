import { writeBinaryFile } from "@tauri-apps/api/fs";
import { resolve } from "@tauri-apps/api/path";

export const minimumTextSize = (text: string) => {
  return text.length > 27 ? text.substring(0, 30) + "..." : text;
};

export const saveImageLocally = async (
  file: File,
  fileName: string,
  path?: string,
): Promise<string | null> => {
  // Convertir el archivo a Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Obtener la ruta de destino en el directorio deseado
  const targetPath = await resolve(
    `${path}/${fileName}` || `data/images/${fileName}`,
  );

  // Guardar el archivo
  return await writeBinaryFile(targetPath, uint8Array)
    .then(() => {
      console.log(fileName);
      return fileName;
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
};
