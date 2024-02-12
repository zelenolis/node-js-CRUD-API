import request from "supertest";
import { requestListener, server } from '../index.ts';

const firstUser = {
    "username": "John",
    "age": "22",
    "hobbies": ["cars", "drinks"]
}

const secondUser = {
    "username": "Doe",
    "age": "44",
    "hobbies": ["games", "milk"]
}

let checkfirstUser = {
    "id": '',
    "username": "John",
    "age": "22",
    "hobbies": ["cars", "drinks"]
}

let checksecondUser = {
    "id": '',
    "username": "Doe",
    "age": "44",
    "hobbies": ["games", "milk"]
}

describe('second test: create two users and check them', () => {
    it("post first user", async () => {
        const response = await request(requestListener).post("/api/users").send(firstUser);
        const rr = JSON.parse(response.text);
        const resUser = rr.data.split(' ').slice(-1)[0];
        checkfirstUser.id = rr.data.split(' ').slice(-2)[0];
        expect(rr.code).toBe(201);
        expect(resUser).toEqual('created');
    });
    it("post second user", async () => {
        const response = await request(requestListener).post("/api/users").send(secondUser);
        const rr = JSON.parse(response.text);
        const resUser = rr.data.split(' ').slice(-1)[0];
        checksecondUser.id = rr.data.split(' ').slice(-2)[0];
        expect(rr.code).toBe(201);
        expect(resUser).toEqual('created');
    });
    it("get all users", async () => {
        const response = await request(requestListener).get("/api/users");
        const rr = JSON.parse(response.text);
        expect(rr.code).toBe(200);
        expect(rr.data[0].username).toEqual("John");
        expect(rr.data[1].username).toEqual("Doe");
    });
    it("check first user", async () => {
        const response = await request(requestListener).get(`/api/users/${checkfirstUser.id}`);
        const rr = JSON.parse(response.text);
        expect(rr.data.username).toEqual("John");
        expect(rr.code).toBe(200);
    });
    it("check second user", async () => {
        const response = await request(requestListener).get(`/api/users/${checksecondUser.id}`);
        const rr = JSON.parse(response.text);
        expect(rr.data.username).toEqual("Doe");
        expect(rr.code).toBe(200);
    });

    afterAll(async () => {
        server.close();
    });
})