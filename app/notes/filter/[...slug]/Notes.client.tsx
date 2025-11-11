"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, NotesResponse } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";

function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  setTimeout(() => setDebouncedValue(value), delay);
  return debouncedValue;
}

interface NotesClientProps {
  page: number;
  search: string;
  tag: string;
}

export default function NotesClient({ page, search, tag }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState(search);
  const [currentPage, setCurrentPage] = useState(page);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const effectivePage = search !== debouncedSearch || tag ? currentPage : 1;

  const { data, isLoading, isError } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", effectivePage, debouncedSearch, tag],
    queryFn: () => fetchNotes(effectivePage, debouncedSearch, tag),
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note
        </button>
      </div>

      <NoteList notes={notes} />

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          forcePage={effectivePage - 1}
          onPageChange={(i) => setCurrentPage(i + 1)}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
