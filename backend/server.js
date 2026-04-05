import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === "production";

const MONGO_URI = isProduction
  ? process.env.MONGO_URI
  : process.env.MONGO_URI_DEV;

const CLIENT_URL = isProduction
  ? process.env.CLIENT_URI
  : process.env.CLIENT_URI_DEV;

const corsOptions = {
  origin: CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (isProduction) {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
}

app.get("/api/test", (req, res) => {
  res.json({ message: "Api conectada"});
});

if (isProduction) {
  app.use((req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    }
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "servidor funcionando"});
  });
}

const startServer = async () => {
  try {
    await connectDB(MONGO_URI);

    server.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      console.log(`Orígenes permitidos: ${CLIENT_URL}`);
      console.log(`Modo: ${isProduction ? "PRODUCCIÓN" : "DESARROLLO"}`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", async () => {
  console.log("\n Cerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado correctamente.");
    process.exit(0);
  });
});