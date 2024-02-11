import http from 'http';
import { serverUsers } from './data/user_storage.ts';

const plainEndpointURL = '/api/users';
const endpointURL = '/api/users/';

export async function getHandling (req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(req.url);
    console.log(req.method);
    if (req.url == plainEndpointURL && req.method === "GET") {
        res.end(JSON.stringify(serverUsers.getAllUsers()));
    } else if (req.url.startsWith(endpointURL) && req.method === "GET") {
        const requestedUser = req.url.slice('/api/users/'.length);
        res.end(JSON.stringify(serverUsers.getCurrentUser(requestedUser as string)));
    } else {
        res.end('get ok');
    }
}