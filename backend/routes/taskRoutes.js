var express = require('express');
var router = express.Router();

// dummy test route (optional)
router.get('/test', (req, res) => res.send("Task route working"));

module.exports = router; // ✅ make sure this is present


var express = require('express');
var router = express.Router();
const auth = require('../middleware/authMiddleware');
const taskBoard = require('../controllers/taskBoardController');
const task = require('../controllers/taskController');

router.use(auth);
router.get('/getBoards', taskBoard.getBoards);
router.post('/addBoard', taskBoard.addBoard);
router.put('/updateBoard/:id', taskBoard.updateBoard);
router.delete('/deleteBoard/:id', taskBoard.deleteBoard);

router.get('/getTasks/:boardId', task.getTasks);
router.post('/addTask/:boardId', task.addTask);
router.put('/updateTask/:taskId', task.updateTask);
router.delete('/deleteTask/:taskId', task.deleteTask);
router.put('/drag', task.dragTask);
module.exports = router;