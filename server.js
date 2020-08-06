var express = require('express');
var app = express();
var http = require('http')

require('./app.js')(app);
http.createServer(app).listen(3000, () => {
    console.log('Server Created')
})