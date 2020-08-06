const bcrypt = require('bcryptjs')
const conn = require('../config/config.json');
var db = require('../models/user')
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose');
const { json } = require('express');
var nodemailer = require("nodemailer");

// Delete the user by token

exports.delete_user = (req, res) => {
    var currentuser = req.headers.authorization;

    jwt.verify(currentuser, conn[1].key, (err, data) => {
        db.deleteOne({ email: data.email }, function(err, doc) {

            if (doc.deletedCount === 0) {

                res.json({
                    sucess: false,
                    message: "User Not Found",
                    data: data,
                })

            } else {
                res.json({
                    sucess: true,
                    message: "User Deleted successfull",
                    data: [""]
                });
            }
        });
    });

}


// Update the user to the token and upgrade the details 

exports.update_user = (req, res) => {
    var currentuser = req.headers.authorization;
    jwt.verify(currentuser, conn[1].key, (err, data) => {
        var content = req.body;
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            db.findByIdAndUpdate(data.id , content, { new: true }, function(err, doc) {
                var databa = {
                    f_name: data.firstName,
                    l_name: data.lastName,
                    email: data.email
                };
                if (doc === null) {
                    return res.json({
                        sucess: false,
                        message: "User not Exist"
                    });
                } else {
                    return res.json({
                        sucess: true,
                        message: "User Updated Successfully",
                        data: doc
                    });
                }
            });
        }else{
            db.findByIdAndUpdate(data.id , content, { new: true }, function(err, doc) {
                var databa = {
                    f_name: data.firstName,
                    l_name: data.lastName,
                    email: data.email,
                    password: data.password,
                }
                if (doc === null) {
    
                    return res.json({
                        sucess: false,
                        message: "User not Exist"
                    });
                } else {
                    return res.json({
                        sucess: true,
                        message: "User Updated Successfully",
                        data: doc
                    });
                }
            });
        } 
    });
}

// Get the user through the token

exports.get_user = (req, res) => {
    var currentuser = req.headers.authorization;
    jwt.verify(currentuser, conn[1].key, (err, datab) => {
        db.findOne({ email: datab.email }, function(err, data) {
            var databb = {
                u_name: data.u_name,
                email: data.email
            }
            if (data === null) {
                return res.json({
                    sucess: false,
                    message: "User Not Exist",
                    data: [""]
                });
            } else {
                return res.json({
                    sucess: true,
                    message: "Users Get Successfully ",
                    data: databb
                });
            }
        });
    });
}

// when we hit the url forgot password then it generate the otp and send it on the user mail.And update the otp in user database
exports.frgpass = (req,res) =>
{
    // we generate six digit random number to create a otp
    var sixdigitsrandom = Math.floor(100000 + Math.random() * 900000); 
    db.findOne({email: req.body.email},(err,user) => {
        if(err || user == null){
            return res.json({
                    sucess: false,
                    message: "User Email Not Exist",
                });
        }else{
            db.findByIdAndUpdate(user._id , {otp:sixdigitsrandom}, { new: true }, (err, data)=>{
                return res.json({
                    sucess: true,
                    message: "Otp is generated",
                    data: data
                });
            })
        }
    });
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: 'myemail@gmail.com',
          pass: 'mypass'
        }, tls: {
          rejectUnauthorized: false
        }
      });
  
    var mailOptions = {
        from: 'myemail@gmail.com',
        to: req.body.email,
        subject: 'Account Varification',
        text: 'Otp '+sixdigitsrandom+" Account Varification"
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return res.json({
                sucess: false,
                message: err,
            });
        } else {
        res.send('Email sent: ' + info.response);
        }
    });
}

// when the otp is sent by using frgpass url.If the body otp and email are matched or find in user database then check the otp if otp is true than move changepass url. 
exports.chckotp = (req,res) =>{
    var content = req.body;
    db.findOne({email:content.email, otp:content.otp}, (err,data) => {
        if(err || data == null){
            return res.json({
                sucess: false,
                message: "Otp not Verified"
            });
        }else{
            return res.json({
                sucess: true,
                message: "Otp verified Successfully"
            });
        }
    });
}


// if the otp is verified than we pass password and confirm password value if it matched than it converted into bcrypt form and save into the database then the password should be reset.
exports.chgpass = (req,res)=>{
    var content = req.body;
    var pass = content.password;
    var cpass = content.confirmpassword;
    if(pass === cpass){
       var passwor = bcrypt.hashSync(pass, 10);
       db.findOneAndUpdate(content.email , {password:passwor}, { new: true }, (err, data)=>{
            if(err || data == null){
                return res.json({
                    sucess: false,
                    message: "Password Not Reset"
                });
            }else{
                return res.json({
                    sucess: false,
                    message: "Password Reset Successfully"
                });
            }
        });
    }else{
        return res.json({
            sucess: false,
            message: "Password Not Matched"
        });
    }
}