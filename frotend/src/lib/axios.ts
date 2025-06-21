import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Une erreur est survenue";

    // On pourrait ajouter ici une notification d'erreur
    console.error("API Error:", message);

    return Promise.reject(error);
  }
);
