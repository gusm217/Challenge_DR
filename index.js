const express = require('express');
const app = express();
app.use(express.json());
const accountsRouter = require('./routes/accountsRoutes');

const { PORT = 3000 } = process.env;

app.use('/accounts', accountsRouter);

app.listen(PORT, () => console.log(`Rodando certin na porta ${PORT}!`));

module.exports = app;