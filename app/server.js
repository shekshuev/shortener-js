import url from "url";
import http from "http";

const urlDatabase = new Map(); // Имитация базы данных для хранения URL

function generateShortURL() {
    return Math.random().toString(36).substring(2, 8); // Генерация случайного идентификатора
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const shortURL = generateShortURL();
            urlDatabase.set(shortURL, body.trim()); // Сохраняем оригинальный URL по его сокращённому идентификатору

            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end(`http://localhost:8080/${shortURL}`);
        });
    } else if (req.method === 'GET') {
        const parsedURL = url.parse(req.url, true);
        const shortURL = parsedURL.pathname.substring(1); // Получаем идентификатор из URL

        const originalURL = urlDatabase.get(shortURL);
        if (originalURL) {
            res.writeHead(307, { Location: originalURL });
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

server.listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});