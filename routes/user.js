var services = require('../controller/user');

module.exports = (router) => {

    // delete the user through token
    router.delete('/user/delete', function(req, res) {
        services.delete_user(req, res);
    })


    // update the user details through token
    router.put('/user/update', function(req, res) {
        services.update_user(req, res);
    })


    // Retrieve the user details through the database
    router.get('/users', function(req, res) {
        services.get_user(req, res);
    })


    // forgot the password
    router.post('/forgot', function(req,res){
        services.frgpass(req,res);
    })


    //check the otp
    router.post('/checkotp', function(req, res) {
        services.chckotp(req,res);
    })

    // change the password
    router.post('/chgpass',(req,res)=>{
        services.chgpass(req,res);
    })
}