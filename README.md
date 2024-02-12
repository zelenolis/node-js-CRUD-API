# node-js-CRUD-API

### Simple CRUD API with in-memory database

task: [link](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)
--
### How to start

1. clone the repository
2. select develop branch
3. rename .env.example into .env
4. Install dependencies running: 
    >npm i
5. start app in developer mode:
    >npm run start
6. start app with multiple instances:
    >npm run start:multi
7. run tests:
    >npm run test

### How to use the CRUD API

+ GET `localhost:api/users` is used to get all persons
+ GET `localhost:api/users/userId` get a user with an id = userId
+ POST `localhost:api/users` with this type of body will create a new user:
    >{
    >    "username": "JohnDoe",
    >    "age": "44",
    >    "hobbies": ["games", "milk"]
    >}
+ PUT `localhost:api/users/userId` with this type of body will update existing user:
    >{
    >    "username": "JohnDoe",
    >    "age": "44",
    >    "hobbies": ["games", "milk"]
    >}
+ DELETE `localhost:api/users/userId` delete existing user