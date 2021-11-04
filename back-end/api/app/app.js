const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');
const { validateToken } = require('../auth/validateToken');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.route('/tasks')
  .get(validateToken, taskController.getAllTasks)
  .post(validateToken, taskController.insertTask)
  .put(validateToken, taskController.updateTask);

app.route('/tasks/:id')
  .get(validateToken, taskController.getTaskById)
  .delete(validateToken, taskController.deleteTask);

app.route('/users')
  .post(userController.createUser);

app.post('/login', userController.login);

const PORT = 8080;

app.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));

module.exports = app;
