// src/services/noteService.js
import api from "./api";

// Get all notes
export const getNotes = async () => {
  return api.get("/notes");
};

// Create new note
export const createNote = async (title, content, category) => {
  return api.post("/notes", { title, content, category });
};

// Update note
export const updateNote = async (id, title, content, category) => {
  return api.put(`/notes/${id}`, { title, content, category });
};

// Delete note
export const deleteNote = async (id) => {
  return api.delete(`/notes/${id}`);
};
