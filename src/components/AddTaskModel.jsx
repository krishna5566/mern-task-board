import React, { useEffect, useState } from "react";
import api from "../../api";

const AddTaskModal = ({ boardId, task = null, onClose, refreshBoards }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const handleSave = async () => {
    if (!title) return;

    if (task?._id) {
      // update task
      await api.put(`/tasks/updateTask/${task._id}`, { title, description });
    } else {
      // add new task
      await api.post(`/tasks/addTask/${boardId}`, { title, description });
    }

    refreshBoards();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-96">
        <h2 className="text-lg font-bold mb-4">
          {task ? "Update Task" : "Add Task"}
        </h2>
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-2 mb-3 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-sm text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-black px-4 py-1 rounded text-sm"
          >
            {task ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
