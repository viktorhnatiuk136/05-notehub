import axios from "axios";
import toast from "react-hot-toast";

import type { Note, NoteTag } from "../types/note";

export interface NoteHTTPResponse {
  notes: Note[];
  page: number;
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  search: string;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export async function fetchNotes({
  page,
  search,
}: FetchNotesParams): Promise<NoteHTTPResponse> {
  try {
    const res = await axios.get("/notes", {
      params: { page, search },
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    // console.log(res.data);

    return res.data;
  } catch (error) {
    toast.error("Failed to fetch notes");
    throw error;
  }
}

interface CreateNoteRequest {
  title: string;
  content: string;
  tag: NoteTag;
}
export async function createNote(data: CreateNoteRequest): Promise<Note> {
  try {
    const res = await axios.post("/notes", data, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to create note");
    throw error;
  }
}

export async function deleteNote(id: string): Promise<Note> {
  try {
    const res = await axios.delete(`/notes/${id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to delete note");
    throw error;
  }
}
