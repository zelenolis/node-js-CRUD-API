import request from "supertest";
import { requestListener, server } from '../index.ts';

const newUser = {
    "username": "John",
    "age": "22",
    "hobbies": []
}

let checkUser = {
    "id": '',
    "username": "John",
    "age": "22",
    "hobbies": []
}

let checkUser2 = {
    "id": '',
    "username": "John",
    "age": "22",
    "hobbies": ['cars', 'drinks']
}

describe('first test: create, update and delete user', () => {
    it("get all users", async () => {
        const response = await request(requestListener).get("/api/users");
        const rr = JSON.parse(response.text);
        expect(rr.code).toBe(200);
        expect(rr.data).toEqual([]);
    });
    it("post new user", async () => {
        const response = await request(requestListener).post("/api/users").send(newUser);
        const rr = JSON.parse(response.text);
        const resUser = rr.data.split(' ').slice(-1)[0];
        checkUser.id = rr.data.split(' ').slice(-2)[0];
        checkUser2.id = checkUser.id
        expect(rr.code).toBe(201);
        expect(resUser).toEqual('created');
    });
    it("update user", async () => {
        const response = await request(requestListener).put(`/api/users/${checkUser.id}`).send(checkUser2);
        const rr = JSON.parse(response.text);
        const resUser = rr.data.split(' ').slice(-1)[0];
        expect(resUser).toEqual('updated');
    });
    it("delete user", async () => {
        const response = await request(requestListener).delete(`/api/users/${checkUser.id}`);
        const rr = JSON.parse(response.text);
        const resUser = rr.data.split(' ').slice(-1)[0];
        expect(resUser).toEqual('deleted');
    });

    afterAll(async () => {
        server.close();
    });
})