const factory = require('../factories');
const app = require('../../src/app');
const request = require('supertest');
const truncate = require("../utils/truncate.js");

const {User} = require('../../src/app/models');

describe('Authentication', () => {

    beforeEach(async ()=>{
        await truncate();
    });

    it('should be able to authenticate with valid credentials', async () => {
        const user = await User.create({
            name: 'Teste',
            email: 'teste@gmail.com',
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
        const user = await User.create({
            name: 'Teste',
            email: 'teste@gmail.com',
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
        const user = await User.create({
            name: 'Teste',
            email: 'teste@gmail.com',
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
        const user = await User.create({
            name: 'Teste',
            email: 'teste@gmail.com',
            password: '123123'
        });

        const response = await request(app)
            .get('/auth')
            .set('Authorization', `Bearer ${user.generateToken()}`);

        expect(response.status).toBe(200);
    });

    it('should not be able to access private routes when not autenticated', async () => {
        const response = await request(app).get('/auth');

        expect(response.status).toBe(401);
    });

    it('should not be able to access private routes when not autenticated', async () => {
        const response = await request(app)
            .get('/auth')
            .set('Authorization', "Bearer 123123");

        expect(response.status).toBe(401);
    });
}); 