import { PostNewUser, User } from './types';
import { randomUUID } from "crypto";


class Users {
    private userList: User[] = [];

    public getAllUsers() {
        return {
            code: 200,
            data: this.userList
        }
    }

    public getCurrentUser(id: string) {
        if (id === '' || id === ' ' || !this.uidValidation(id)) {
            return {
                code: 400,
                data: `The user's Id is invalid`
            }
        } else if (this.userList.find(element => element.id === id)) {
            return {
                code: 200,
                data: this.userList.find(element => element.id === id)
            }
        } else {
            return {
                code: 404,
                data: `record with id = ${id} doesn't exist`
            }
        }
    }

    public addUser(newUser: PostNewUser) {
        const uid = randomUUID().toString();
        const newItem: User = {
            id: uid,
            username: newUser.username,
            age: newUser.age,
            hobbies: newUser.hobbies ? newUser.hobbies : []
        }
        this.userList.push(newItem);
        return {
            code: 201,
            data: `user with id = ${uid} created`
        }
    }

    public updateUser(updId: string, updUser: PostNewUser) {
        if (updId === '' || updId === ' ' || !this.uidValidation(updId)) {
            return {
                code: 400,
                data: `The user's Id is invalid`
            }
        } else if (this.userList.find(element => element.id === updId)) {
            const updItem: User = {
                id: updId,
                username: updUser.username,
                age: updUser.age,
                hobbies: updUser.hobbies ? updUser.hobbies : []
            }
            this.userList = this.userList.filter(element => element.id !== updId);
            this.userList.push(updItem);
            return {
                code: 200,
                data: `user with id = ${updId} updated`
            }
        } else {
            return {
                code: 404,
                data: `user with id = ${updId} doesn\'t exists`
            }
        }        
    }

    public deleteUser(delId: string) {
        if (delId === '' || delId === ' ' || !this.uidValidation(delId)) {
            return {
                code: 400,
                data: `The user's Id is invalid`
            }
        } else if (this.userList.find(element => element.id === delId)) {
            this.userList = this.userList.filter(element => element.id !== delId);
            return {
                code: 204,
                data: `user with id = ${delId} found and deleted`
            }
        } else {
            return {
                code: 404,
                data: `user with id = ${delId} doesn\'t exists`
            }
        }
    }

    private uidValidation(uid: string) {
        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return uuidPattern.test(uid);
    }
}

export const serverUsers = new Users;