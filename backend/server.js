import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";


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
  ? process.env.CLIENT_URI_PROD || process.env.CLIENT_URI
  : process.env.CLIENT_URI_DEV || process.env.CLIENT_URI || "http://localhost:5173";

const corsOptions = {
  origin: CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


if (isProduction) {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  
  app.use((req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    }
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "Servidor funcionando" });
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