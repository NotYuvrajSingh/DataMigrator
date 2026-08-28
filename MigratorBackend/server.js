const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/location', (req, res) => {
    console.log('Received:', req.body);

    res.json({
        message: 'Request received',
        data: req.body
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});