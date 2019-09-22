const factory = require('../factories');
const nodemailer = require('nodemailer');
const app = require('../../src/app');
const request = require('supertest');
const truncate = require("../utils/truncate.js");

jest.mock('nodemailer');

const transporter = {
    sendMail: jest.fn()
}

describe('Authentication', () => {

    beforeEach(async ()=>{
        await truncate();
    });

    beforeAll(()=>{
        nodemailer.createTransport.mockReturnValue(transporter);
    });

    it('should be able to authenticate with valid credentials', async () => {
        const user = await factory.create('User', {
            password: '123456'
        });
        
        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email, 
                password: '123456'
            });

        expect(response.status).toBe(200);
    });

    it('should not be able to authenticate with valid credentials', async () => {
        const user = await factory.create('User', {
            password: '123123'
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email, 
                password: '123456'
            });

        expect(response.status).toBe(401);
    });

    it('should return jwt token when autenticated', async () => {
        const user = await factory.create('User', {
            password: '123123'
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email, 
                password: '123123'
            });

        expect(response.body).toHaveProperty('token');
    });

    it('should able to access private routes when autenticated', async () => {
        const user = await factory.create('User');

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ${user.generateToken()}`);

        expect(response.status).toBe(200);
    });

    it('should not be able to access private routes when not autenticated', async () => {
        const response = await request(app).get('/dashboard');

        expect(response.status).toBe(401);
    });

    it('should not be able to access private routes when not autenticated', async () => {
        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', "Bearer 123123");

        expect(response.status).toBe(401);
    });

    it('should receib email notification when authenticated', async () => {
        const user = await factory.create('User', {
            password: '123123'
        });

        await request(app)
            .post('/sessions')
            .send({
                email: user.email, 
                password: '123123'
            });

        expect(transporter.sendMail).toHaveBeenCalledTimes(1);
        expect(transporter.sendMail.mock.calls[0][0].to).toBe(
            `${user.name} <${user.email}>`
        );
    });
}); 