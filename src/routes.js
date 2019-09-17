const routes = require('express').Router();
const {User} = require('./app/models')
routes.get('/', async (req, res) => {
    
    const user = await User.create({
        name: 'Duarte',
        email: 'matheusd007@gmail.com',
        password_hash: '123456'
    });

    return res.json({user});
});

module.exports = routes;