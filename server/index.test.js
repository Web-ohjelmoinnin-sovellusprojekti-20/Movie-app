import { expect } from "chai";
import { before } from "mocha";
import { initializeTestDatabase, insertTestAccount, getToken } from "./helpers/test.js";

const base_url = 'http://localhost:3001';

describe('GET accounts', () => {
    before(() => {
        initializeTestDatabase();
    });

    it('should return an empty json object', async () => {
        const response = await fetch(base_url + '/account/account');
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.be.empty;
    });
});
describe('POST register', () => {
    const email = 'test@example.com';
    const password = 'Te5tpassword';

    it('should create a new account with the correct credentials', async() => {
        const response = await fetch(base_url + '/account/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        });
        const data = await response.json();
        expect(response.status).to.equal(201);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('email');
    });

    it('should not create a new account with wrong email', async() => {
        const wrongEmail = 'test.example.com';
        const response = await fetch(base_url + '/account/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': wrongEmail, 'password': password })
        });
        const data = await response.json();
        expect(response.status).to.equal(400);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error');
    });

    it('should not create a new account with an invalid password', async() => {
        const invalidPassword = 'test';
        const response = await fetch(base_url + '/account/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': invalidPassword })
        });
        const data = await response.json();
        expect(response.status).to.equal(400);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error');
    });
});

describe('POST login', () => {
    const login_email = 'test@example.com';
    const login_password = 'Te5tpassword';
    it('should login successfully with valid credentials', async() => {
        const response = await fetch(base_url + '/account/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': login_email, 'password': login_password })
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('email','token');
    });

    it('should not login successfully with wrong email', async() => {
        const wrongEmail = 'wrong.example.com';
        const response = await fetch(base_url + '/account/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': wrongEmail, 'password': login_password })
        });
        const data = await response.json();
        expect(response.status).to.equal(401);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error');
    });

    it('should not login successfully with wrong password', async() => {
        const wrongPassword = 'wrongpassword';
        const response = await fetch(base_url + '/account/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': login_email, 'password': wrongPassword })
        });
        const data = await response.json();
        expect(response.status).to.equal(401);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('error');
    });
});