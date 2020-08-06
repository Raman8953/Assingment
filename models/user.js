const db = require('./db');
const mongoose = require('mongoose');
var schema = db.Schema({
    u_name: { type: String, require: true, trim: true },
    email: { type: String, require: true, trim: true },
    password: { type: String, require: true, trim: true },
    otp: {type: String,default:''}
});

schema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
}
// compilation of schema 
module.exports = db.model('user', schema)