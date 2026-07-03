import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname, { index: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', "GET,POST,OPTIONS");
    res.header('Access-Control-Allow-Headers', "Content-Type");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const users = [
    {
        email: "div@gmail.com",
        password: "div123"
    },
    {
        email: "admin@gmail.com",
        password: "admin123"
    }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/typing', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
    const email = req.body.email || req.body.username;
    const password = req.body.password;
    const user = users.find(u => u.email === email);

    if (user && user.password === password) {
        return res.redirect(303, '/typing#typing');
    }

    return res.redirect(303, '/?error=Invalid%20email%20or%20password');
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});