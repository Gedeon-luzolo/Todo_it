import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import taskRoutes from "./routes/task.routes";

export const app = express();
dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Servir des fichiers statiques à express
// const public_path = path.join(__dirname, "./dist");
// app.use(express.static(public_path));
// app.get("*", (_, res) => {
//   res.sendFile(path.join(public_path, "index.html"));
// });

// Routes
app.use("/tasks", taskRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
