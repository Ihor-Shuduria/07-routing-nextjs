"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

export default function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id!),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <div className={css.container}>
      <Modal onClose={handleClose}>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error: {error?.message}</p>}
        {note && (
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              <span className={css.tag}>{note.tag}</span>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <button onClick={handleClose} className={css.backBtn}>
              ← Back to notes
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
