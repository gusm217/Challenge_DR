const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')
const errors = require('./middlewares/errors');
const app = express();
app.use(express.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const accountsRouter = require('./routes/accountsRoutes');

const PORT = process.env.PORT || 3000;

app.use('/accounts', accountsRouter);
app.use(errors)

app.listen(PORT, () => console.log(`Running on port ${PORT}!`));

module.exports = app;