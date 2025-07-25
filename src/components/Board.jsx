import React, { useState } from "react";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModel";
import AddBoardModal from "./AddBoardModal";
import { Pencil , Trash} from "lucide-react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import api from "../../api";


const Board = ({ board, refreshBoards }) => {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openBoardModal, setOpenBoardModal] = useState(false);
  const handleDelete = async () => {
    await api.delete(`/tasks/deleteBoard/${board._id}`);
    refreshBoards();
  };
  return (
    <div className="bg-white rounded-xl shadow-md w-80 min-w-[320px] max-h-[78vh] flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold text-lg">{board.title}</h2>
        <div className="flex items-center gap-2">
          <div
            onClick={() => setOpenTaskModal(true)}
            className="text-blue-500 text-sm px-2 hover:underline cursor-pointer"
          >
            + Task
          </div>
          <div
            onClick={() => setOpenBoardModal(true)}
            className="text-gray-500 hover:text-blue-600"
            title="Edit Board"
          >
            <Pencil size={14} />
          </div>
           <div onClick={handleDelete}><Trash size={14} className="text-red-500" /></div>
        </div>
      </div>

 
<Droppable droppableId={board._id}>
  {(provided) => (
    <div
      className="flex-1 overflow-y-auto p-2 space-y-2"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      {board.tasks.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-4">
          No tasks available.
        </div>
      ) : (
        board.tasks.map((task, index) => (
          <Draggable draggableId={task._id} index={index} key={task._id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <TaskCard task={task} boardId={board._id} refreshBoards={refreshBoards} />
              </div>
            )}
          </Draggable>
        ))
      )}
      {provided.placeholder}
    </div>
  )}
</Droppable>


      {openTaskModal && (
        <AddTaskModal
          boardId={board._id}
          onClose={() => setOpenTaskModal(false)}
          refreshBoards={refreshBoards}
        />
      )}

      {openBoardModal && (
        <AddBoardModal
          board={board}
          onClose={() => setOpenBoardModal(false)}
          refreshBoards={refreshBoards}
        />
      )}
    </div>
  );
};

export default Board;
