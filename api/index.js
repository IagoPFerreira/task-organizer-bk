const express = require('express');

const app = express();

app.get('/', (_req, res) => res.send('Home'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));
