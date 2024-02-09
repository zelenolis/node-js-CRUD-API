import os from 'os';
import http, { IncomingMessage } from 'http';
import cluster from 'cluster';
import { serverUsers } from './data/user_storage.ts';
import { User, PostNewUser } from './data/types.ts';

const PORT = 4000;
const plainEndpointURL = '/api/users';
const endpointURL = '/api/users/';
const pid = process.pid;

const requestListener: http.RequestListener = async (req, res) => {
    if (req.url == plainEndpointURL && req.method === "GET") {
        res.end(JSON.stringify(serverUsers.getAllUsers()));
    } else if (req.url.startsWith(endpointURL) && req.method === "GET") {
        const requestedUser = req.url.slice('/api/users/'.length);
        res.end(JSON.stringify(serverUsers.getCurrentUser(requestedUser as string)));
    } else if (req.method === "POST") {
        let body = ''; 
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const parsedJson = await JSON.parse(body);
                if (!parsedJson.username || !parsedJson.age || !parsedJson.hobbies) {
                    const responseErr = {
                        code: 400,
                        data: '"username", "age", "hobbies" are required fields'
                    }
                    res.end(JSON.stringify(responseErr));
                } else {
                    const createNew: PostNewUser = {
                        username: parsedJson.username || "",
                        age: parsedJson.age || 0,
                        hobbies: parsedJson.hobbies || []
                    }
                    res.end(JSON.stringify(serverUsers.addUser(createNew)));
                }
            } catch (error) {
                console.error('Error parsing JSON:', error.message);
                const responseErr = {
                    code: 400,
                    data: 'Invalid JSON format'
                };
                res.end(JSON.stringify(responseErr));
            }
        });
    } else if (req.url.startsWith(endpointURL) && req.method === "DELETE") {
        const requestedUser = req.url.slice('/api/users/'.length);
        res.end(JSON.stringify(serverUsers.deleteUser(requestedUser as string)));
    } else {
        res.end({
            code: 404,
            data: 'The requested resource is not found'
        });
    }
}

const server = http.createServer(requestListener);

server.listen(4000, () => {
    console.log('Server running at http://localhost:4000');
});