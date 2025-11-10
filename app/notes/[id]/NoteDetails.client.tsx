"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

interface NoteDetailsProps {
  noteId: string;
  initialNote?: Note;
}

export default function NoteDetailsClient({
  noteId,
  initialNote,
}: NoteDetailsProps) {
  const { data: note, isLoading } = useQuery<Note, Error>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    initialData: initialNote,
    refetchOnMount: false,
    staleTime: 30_000,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (!note) return null;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.date}>
          Created at: {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
