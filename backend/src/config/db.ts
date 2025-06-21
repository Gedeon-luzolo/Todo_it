import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "task-db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Script SQL pour créer la table tasks si elle n'existe pas
const createTasksTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('TODO', 'IN_PROGRESS', 'DONE') DEFAULT 'TODO',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.execute(createTableQuery);
    console.log("Table tasks créée ou déjà existante");
  } catch (error) {
    console.error("Erreur lors de la création de la table tasks:", error);
    throw error;
  }
};

// Initialiser la base de données
createTasksTable();

// Test de la connexion
pool
  .getConnection()
  .then((connection) => {
    console.log("Connexion à la base de données réussie");
    connection.release();
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données:", err);
  });
