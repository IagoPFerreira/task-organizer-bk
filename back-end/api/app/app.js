const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.route('/tarefas')
  .get(taskController.getAllTasks)
  .post(taskController.insertTask)
  .put(taskController.updateTask);

app.route('/tarefas/:id')
  .get(taskController.getTaskById)
  .delete(taskController.deleteTask);

app.route('/users')
  .post(userController.createUser);

app.post('/login', userController.login);

const PORT = 8080;

app.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));

module.exports = app;
