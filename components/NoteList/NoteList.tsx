import Link from "next/link";
import css from "./NoteList.module.css";
import { deleteNote } from "../../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "@/types/note";

interface NoteListProps {
  notes: Note[];
  onDeleted?: () => void;
}

export default function NoteList({ notes, onDeleted }: NoteListProps) {
  const qc = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      onDeleted?.();
    },
    onError: () => {
      alert("Failed to delete note.");
    },
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this note?")) return;
    await mutateAsync(id);
  }

  if (!notes || notes.length === 0) return <p>No notes yet.</p>;

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <div className={css.actions}>
              <Link href={`/notes/${n.id}`} className={css.link}>
                View details
              </Link>

              <button
                className={css.button}
                onClick={() => handleDelete(n.id)}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
