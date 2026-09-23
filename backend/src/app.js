const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'VIT-MITRA API is running' });
});

module.exports = app;
