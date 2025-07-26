const Task = require('../models/Task');
const TaskBoard = require('../models/TaskBoard');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ board: req.params.boardId });
    res.status(200).json({ status: true, message: 'Tasks fetched successfully', data: tasks });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to fetch tasks', error: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const board = await TaskBoard.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ status: false, message: 'Board not found' });
    }

    if (board.user.toString() !== req.userId) {
      return res.status(403).json({ status: false, message: 'You are not authorized to add tasks to this board' });
    }

    const task = await Task.create({ ...req.body, board: req.params.boardId });
    res.status(201).json({ status: true, message: 'Task added successfully', data: task });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to add task', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ status: false, message: 'Task not found' });
    }

    const board = await TaskBoard.findById(task.board);
    if (!board || board.user.toString() !== req.userId) {
      return res.status(403).json({ status: false, message: 'You are not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });

    res.status(200).json({ status: true, message: 'Task updated successfully', data: updatedTask });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to update task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ status: false, message: 'Task not found' });
    }

    const board = await TaskBoard.findById(task.board);
    if (!board || board.user.toString() !== req.userId) {
      return res.status(403).json({ status: false, message: 'You are not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to delete task', error: error.message });
  }
};

const dragTask = async (req, res) => {
  try {
    const { taskId, destinationBoardId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ status: false, message: 'Task not found' });
    }

    const sourceBoard = await TaskBoard.findById(task.board);
    const destinationBoard = await TaskBoard.findById(destinationBoardId);

    if (
      !sourceBoard ||
      !destinationBoard ||
      sourceBoard.user.toString() !== req.userId ||
      destinationBoard.user.toString() !== req.userId
    ) {
      return res.status(403).json({ status: false, message: 'You are not authorized to move this task' });
    }

    task.board = destinationBoardId;
    await task.save();

    res.status(200).json({ status: true, message: 'Task moved successfully', data: task });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to move task', error: error.message });
  }
};

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  dragTask,
};
