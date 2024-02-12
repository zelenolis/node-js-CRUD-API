import http from 'http';
import { serverUsers } from './data/user_storage.ts';
import { PostNewUser } from './data/types.ts';

const plainEndpointURL = '/api/users';
const endpointURL = '/api/users/';

export const requestListener: http.RequestListener = async (req, res) => {
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
                const responseErr = {
                    code: 400,
                    data: 'Invalid JSON format'
                };
                res.end(JSON.stringify(responseErr));
            }
        });
    } else if (req.method === "PUT") {
        let body = ''; 
        const updId = req.url.slice('/api/users/'.length);
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
                    const updateUser: PostNewUser = {
                        username: parsedJson.username || "",
                        age: parsedJson.age || 0,
                        hobbies: parsedJson.hobbies || []
                    }
                    res.end(JSON.stringify(serverUsers.updateUser(updId as string, updateUser)));
                }
            } catch (error) {
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

export const server = http.createServer(requestListener);

server.listen(4000, () => {
    console.log('Server running at http://localhost:4000');
});