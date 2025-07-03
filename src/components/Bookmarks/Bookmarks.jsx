import { useEffect, useState } from "react";
import bookmarkService from "../../api/apiService/bookmarkService";
import CategoryBar from "../notes/CategoryBar";
import NoteCard from "../notes/NoteCard";

const Bookmarks = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [category, setCategory] = useState("");

  const fetchNotes = async (pageNum = 1, categoryName = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await bookmarkService.getBookmarkedNotes({ category_name: categoryName, page: pageNum });
      if (Array.isArray(res)) {
        setNotes(res);
        setCount(res.length);
        setNext(null);
        setPrev(null);
      } else {
        setNotes(res.results || []);
        setCount(res.count || 0);
        setNext(res.next);
        setPrev(res.previous);
      }
      setPage(pageNum);
    } catch (err) {
      setError(err?.detail || "Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(1, category);
    // eslint-disable-next-line
  }, [category]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Bookmarked Notes</h1>
      <div className="mb-6">
        <CategoryBar onCategorySelect={setCategory} selectedCategory={category} />
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No bookmarks found.</div>
      ) : (
        <div className="grid gap-6">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => fetchNotes(page - 1, category)}
          disabled={!prev || loading || page === 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-2 py-2">Page {page}</span>
        <button
          onClick={() => fetchNotes(page + 1, category)}
          disabled={!next || loading}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Bookmarks; 