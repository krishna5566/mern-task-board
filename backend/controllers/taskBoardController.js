const TaskBoard = require('../models/TaskBoard');

const getBoards = async (req, res) => {
  try {
    const boards = await TaskBoard.find({ user: req.userId });
    res.status(200).json({ status: true, message: 'Boards fetched successfully', data: boards });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to fetch boards', error: error.message });
        console.log(error)

  }
};
const addBoard = async (req, res) => {
  try {
    const board = await TaskBoard.create({ title: req.body.title, user: req.userId });
    res.status(201).json({ status: true, message: 'Board created successfully', data: board });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to create board', error: error.message });
    console.log(error)
  }
};

const updateBoard = async (req, res) => {
  try {
    const board = await TaskBoard.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ status: false, message: 'Board not found' });
    }

    if (board.user.toString() !== req.userId) {
      return res.status(403).json({ status: false, message: 'You are not authorized to update this board' });
    }

    board.title = req.body.title || board.title;
    await board.save();

    res.status(200).json({ status: true, message: 'Board updated successfully', data: board });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to update board', error: error.message });
  }
};


const deleteBoard = async (req, res) => {
  try {
    const board = await TaskBoard.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ status: false, message: 'Board not found' });
    }

    if (board.user.toString() !== req.userId) {
      return res.status(403).json({ status: false, message: 'You are not authorized to delete this board' });
    }

    await board.deleteOne();
    res.status(200).json({ status: true, message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to delete board', error: error.message });
  }
};


module.exports = {
  getBoards,
  addBoard,
  updateBoard,
  deleteBoard,
};
