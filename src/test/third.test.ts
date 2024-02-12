import request from "supertest";
import { requestListener, server } from '../index.ts';

const newUser = {
    "age": "22",
    "hobbies": []
}

describe('second test: bad requests', () => {
    it("wrong adress", async () => {
        const response = await request(requestListener).get("/api/users/asdf");
        const rr = JSON.parse(response.text);
        expect(rr.code).toBe(400);
    });
    it("user doesnt exist", async () => {
        const response = await request(requestListener).get("/api/users/21f3ba56-1d1e-4a18-aa75-d7275c398283");
        const rr = JSON.parse(response.text);
        expect(rr.code).toBe(404);
    });
    it("post wrong user", async () => {
        const response = await request(requestListener).post("/api/users").send(newUser);
        const rr = JSON.parse(response.text);
        expect(rr.code).toBe(400);
    });
    it("delete wrong user", async () => {
        const response = await request(requestListener).delete(`/api/users/21f3ba56-1d1e-4a18-aa75-d7275c398283`);
        const rr = JSON.parse(response.text);
        expect(rr.code).toBe(404);
    });

    afterAll(async () => {
        server.close();
    });
})