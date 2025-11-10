export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export const tagsList: string[] = [
  "All",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Todo",
];