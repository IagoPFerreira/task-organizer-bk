/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskController = require('./controllers/taskController');
const userController = require('./controllers/userController');
const { validateToken } = require('./middlewares/validateToken');
const error = require('./middlewares/error');

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
  .post(userController.createUser)
  .get(validateToken, userController.findAllUsers);

app.post('/users/admin', validateToken, userController.createAdmin);

app.post('/login', userController.login);

app.use(error);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));

module.exports = app;
