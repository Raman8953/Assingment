// Add the middelware bodyparser thet add the user data
const bodyParser = require('body-parser');
const index = require('./routes/index');
module.exports = (app) => {
    app.set('view engine', 'jade');
    app.use(bodyParser.urlencoded({ extended: true}))
    app.use(bodyParser.json())

    app.use('/api', index);

    //invalid url
    app.all('*', (req, res) => {
        res.send("invalid url " + String(req.url));
    });

}