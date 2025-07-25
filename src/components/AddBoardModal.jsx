import React, { useState, useEffect } from "react";
import api from "../../api";

const AddBoardModal = ({ board = null, onClose, refreshBoards }) => {
  const [title, setTitle] = useState(board?.title || "");

  useEffect(() => {
    if (board) {
      setTitle(board.title);
    }
  }, [board]);

  const handleSave = async () => {
    if (!title) return;
    if (board?._id) {
      await api.put(`/tasks/updateBoard/${board._id}`, { title });
    } else {
      await api.post("/tasks/addBoard", { title });
    }
    refreshBoards();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-96">
        <h2 className="text-lg font-bold mb-4">
          {board ? "Edit Board" : "Add Board"}
        </h2>
        <input
          className="w-full border p-2 mb-4 rounded"
          placeholder="Board Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-sm text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-black px-4 py-1 rounded text-sm"
          >
            {board ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBoardModal;
