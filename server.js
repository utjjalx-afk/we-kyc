const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint to bypass CORS issues for local testing
app.post('/api/proxy/create_kyc_link', async (req, res) => {
    try {
        const payload = req.body;
        
        if (!payload.api_key) {
            return res.status(400).json({ error: "api_key is required in the payload" });
        }

        const response = await axios.post(
            'https://api.wekyc.io/api/v1/create_kyc_link',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json(
            error.response ? error.response.data : { error: error.message }
        );
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
