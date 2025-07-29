import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user and notes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setNotes(res.data.notes || []);
      } catch (error) {
        console.error("Redirecting to login:", error);
        navigate("/signin");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    navigate("/");
  };

  const handleAddNote = async () => {
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/notes",
        { content: noteInput },
        { withCredentials: true }
      );
      setNoteInput("");
      // Fetch updated notes
      const notesRes = await axios.get("http://localhost:5000/api/user", {
        withCredentials: true,
      });
      setNotes(notesRes.data.notes || []);
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        withCredentials: true,
      });

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Logo and Heading */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
          <img
            src={"/images/icon.png"}
            alt="App Logo"
            className="w-10 h-10"
          />
            <h1 className="ml-10 text-xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-600 text-sm font-medium  hover:underline"
          >
            Sign Out
          </button>
        </div>

        {/* Welcome Message */}
        <div className="mb-4 text-center">
          <p className="text-lg font-bold">Welcome, {user.name}!</p>
          <p className="text-gray-600 text-sm mt-1">Email: {user.email}</p>
        </div>

        {/* Input */}
        <div className="flex mb-4">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Write a new note..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddNote}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {/* Notes List */}
        <div>
          {notes.length === 0 ? (
            <p className="text-gray-500 text-sm">No notes yet.</p>
          ) : (
            notes.map((note) =>
              note && note._id ? (
                <div
                  key={note._id}
                  className="flex justify-between items-center bg-white border rounded-md shadow-sm px-4 py-2 mb-2"
                >
                  <span className="text-sm font-medium">{note.content}</span>
                  <button onClick={() => handleDeleteNote(note._id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-black hover:text-black transition"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3"
                      />
                    </svg>
                  </button>
                </div>
              ) : null
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
