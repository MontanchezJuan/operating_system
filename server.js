import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fs from "fs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint para guardar claves faltantes
app.post("/locales/:lng/missing.json", (req, res) => {
  const { lng } = req.params;
  const filePath = `./public/locales/${lng}/missing.json`;
  const missingKeys = req.body;

  // Leer archivo existente o crear uno nuevo
  const existingKeys = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
    : {};

  // Combinar claves nuevas con las existentes
  const updatedKeys = { ...existingKeys, ...missingKeys };

  // Guardar las claves en el archivo
  fs.writeFileSync(filePath, JSON.stringify(updatedKeys, null, 2));

  res.status(200).send("Keys saved successfully");
});

app.listen(3001, () => console.log("Listening on http://localhost:3001"));
