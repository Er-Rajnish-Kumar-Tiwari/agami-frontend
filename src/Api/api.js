import axios from "axios";

const API = axios.create({
  baseURL: "https://agami-interview-backend.onrender.com/api",
});

export const saveGame = (data) => API.post("/games", data);
export const getGames = () => API.get("/games");