const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskController = require('./controllers/taskController');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', taskController.getAllTasks);

const PORT = 8080;

app.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));
