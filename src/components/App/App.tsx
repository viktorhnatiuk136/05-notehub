import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import css from "./App.module.css";

import type { NoteHTTPResponse } from "../../services/noteService";

import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";

function App() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data } = useQuery<NoteHTTPResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, search }),
  });

  const notesList = data?.notes;
  const totalPages = data?.totalPages;

  const modalOpen = () => {
    setIsModalOpen(true);
  };
  const modalClose = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      modalClose();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          {<SearchBox search={search} onSearch={debouncedSearch} />}
          {totalPages && totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
          {
            <button className={css.button} onClick={modalOpen}>
              Create note +
            </button>
          }
        </header>

        {notesList && notesList.length > 0 && (
          <NoteList notes={notesList} onDelete={deleteMutation.mutate} />
        )}
        {isModalOpen && (
          <Modal onClose={modalClose}>
            <NoteForm onClose={modalClose} onCreate={createMutation.mutate} />
          </Modal>
        )}
      </div>
    </>
  );
}

export default App;
