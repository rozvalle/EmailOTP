const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', require('./routes/auth'));

app.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});

const PORT = 4000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
