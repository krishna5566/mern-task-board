import React, { useState } from "react";
import AddTaskModal from "./AddTaskModel";
import api from "../../api";
import { Pencil, Trash } from "lucide-react";

const TaskCard = ({ task, boardId, refreshBoards }) => {
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    await api.delete(`/tasks/deleteTask/${task._id}`);
    refreshBoards();
  };

  return (
    <>
      <div className="bg-gray-100 p-3 rounded-md shadow-sm relative">
        <div className="absolute top-2 right-2 flex gap-2">
          <Pencil
            size={14}
            className="cursor-pointer text-blue-600"
            onClick={() => setOpenEdit(true)}
          />
          <Trash
            size={14}
            className="cursor-pointer text-red-500"
            onClick={handleDelete}
          />
        </div>
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
      </div>

      {openEdit && (
        <AddTaskModal
          boardId={boardId}
          task={task}
          onClose={() => setOpenEdit(false)}
          refreshBoards={refreshBoards}
        />
      )}
    </>
  );
};

export default TaskCard;
