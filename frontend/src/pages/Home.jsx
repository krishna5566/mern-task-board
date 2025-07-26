import React, { useEffect, useRef, useState } from "react";
import Board from "../components/Board";
import api from "../../api";
import AddBoardModal from "../components/AddBoardModal"; 
import { Plus } from "lucide-react";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";

const Home = () => {
 const [boards, setBoards] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSmallMenu, setOpenSmallMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const fetchBoards = async () => {
    const { data } = await api.get("/tasks/getBoards");
    const boardsWithTasks = await Promise.all(
      data.data.map(async (board) => {
        const res = await api.get(`/tasks/getTasks/${board._id}`);
        return { ...board, tasks: res.data.data };
      })
    );
    setBoards(boardsWithTasks);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenSmallMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    fetchBoards();
  }, []);


const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};



const onDragEnd = async (result) => {
  const { source, destination, draggableId } = result;

  if (!destination) return;

  try {
    await api.put("/tasks/drag", {
      taskId: draggableId,
      sourceBoardId: source.droppableId,
      destinationBoardId: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });
    fetchBoards();
  } catch (err) {
    console.error("Drag error:", err);
  }
};
return (
  <div className="relative p-4 min-h-screen bg-[#f4f4f4]">

    <div className="flex justify-between mb-4 items-center">
      <h1 className="text-2xl font-bold text-black">Task Boards</h1>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-black mr-20 px-4 py-2 rounded text-sm flex items-center gap-2"
      >
        <Plus size={16} /> Add Board
      </button>
    </div>
    <DragDropContext onDragEnd={onDragEnd}>

    <div className="flex overflow-x-auto gap-4">
     {boards.length === 0 ? (
    <div className="text-gray-500 text-lg mt-10 mx-auto w-full text-center">
      No boards found. Click "Add Board" to create one.
    </div>
  ) : (
    boards.map((board) => (
      <Board key={board._id} board={board} refreshBoards={fetchBoards} />
    ))
  )}
    </div>
    </DragDropContext>
     <div className="fixed top-6 right-4 z-50" ref={menuRef}>
      <button
        onClick={() => setOpenSmallMenu((prev) => !prev)}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
      >
        <User />
      </button>

      {openSmallMenu && (
        <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded z-10">
          <button   onClick={() => navigate("/profile")} className="w-full px-4 py-2 hover:bg-gray-100 text-left">
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 hover:bg-gray-100 text-left flex items-center gap-2 text-red-500"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </div>


    {open && <AddBoardModal onClose={() => setOpen(false)} refreshBoards={fetchBoards} />}
  </div>
);


};

export default Home;
