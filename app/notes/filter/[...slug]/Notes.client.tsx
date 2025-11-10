"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

interface NotesClientProps {
  page: number;
  search: string;
}

export default function NotesClient({ page, search }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [searchQuery, setSearchQuery] = useState<string>(search);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage((prev) => (prev !== 1 ? 1 : prev));
    }, 0);
    return () => clearTimeout(t);
  }, [debouncedSearch]);

  const { data, isLoading, isError } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, debouncedSearch),
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note
        </button>
      </div>

      <NoteList notes={data?.notes ?? []} />

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          forcePage={currentPage - 1}
          onPageChange={(p: number) => setCurrentPage(p + 1)}
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
