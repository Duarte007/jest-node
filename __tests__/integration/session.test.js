const {User} = require('../../src/app/models');
const app = require('../../src/app');
const request = require('supertest');

console.log(process.env.NODE_ENV);

describe('Authentication', () => {
    
    it('should be able to authenticate with valid credentials', async () => {
        const user = await User.create({
            name: 'Teste',
            email: 'teste@gmail.com',
            password_hash: '123456'
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email, 
                passowrd: '123456'
            });
            console.log(response);
        expect(response.status).toBe(200);
    });

});