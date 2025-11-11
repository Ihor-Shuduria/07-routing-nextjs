import axios from "axios";
import toast from "react-hot-toast";
import { Note } from "@/types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_NOTEHUB_BASE_URL ??
    "https://notehub-public.goit.study/api",
  headers: {
    accept: "application/json",
    Authorization: token ? `Bearer ${token}` : undefined,
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    toast.error(`API Error: ${message}`);
    return Promise.reject(error);
  }
);

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export type CreateNoteInput = {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
};

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage: 12,
  };

  if (search) params.search = search;
  if (tag && tag !== "all") params.tag = tag;

  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    { params }
  );

  return { notes: data.notes, totalPages: data.totalPages };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: CreateNoteInput): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  toast.success("Note added successfully!");
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  toast.success("Note deleted successfully!");
  return data;
};
