const auth = require('../controller/auth')
const express = require('express')
const router = express.Router();

router
    .route('/auth/register')
    .post(auth.register)


router
    .route('/auth/login')
    .post(auth.tokeninn)

//    create a middleware to check the router authenticate or not
require('./user')(router);

module.exports = router