const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const cookieParser = require('cookie-parser');

const app = express();


app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(cookieParser());

app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});