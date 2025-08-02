export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Debug logging
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    try {
        // Prepare headers for the backend request
        const headers = {
            'Content-Type': 'application/json',
        };

        // Copy authorization header if present
        if (req.headers.authorization) {
            headers.authorization = req.headers.authorization;
        }

        // Prepare the request body
        let body = null;
        if (req.method === 'POST' && req.body) {
            body = JSON.stringify(req.body);
        }

        console.log('Sending to backend:', {
            method: req.method,
            headers: headers,
            body: body
        });

        const response = await fetch('http://3.26.213.105:4000/graphql', {
            method: req.method,
            headers: headers,
            body: body
        });

        const data = await response.json();
        console.log('Backend response:', data);
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: error.message });
    }
}

// Configure Vercel to parse JSON bodies
export const config = {
    api: {
        bodyParser: true,
    },
};