const Userdata = require('../modules/users');
const amdata = require('../modules/am');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const alert = require("alert");

app.use(cookieParser());
let userID = '';
let Msg = '';

exports.gethome = async (req,res)=>{
    const user = Userdata.findOne({_id:req.user});
    res.render('index',{
        imagename:user.profileImg,
        name:user.name,
        emailID:user.email,
        phoneNo:user.phone,
        resetMsg:'',
        userID
    });
}

exports.getregister = async (req,res)=>{
    res.render('register',{
        userID
    });
}
exports.registration = async (req,res)=>{
    res.render('registration',{
        userID,
        Msg:''
    });
}

exports.getlogin = async (req,res)=>{
    res.render('login',{
        userID,
        Msg
    });
}

exports.postregister = async (req,res)=>{
    try {
        let password = req.body.password;
        let cpassword = req.body.cpassword;
        if(password === cpassword){
            password = await bcryptjs.hash(password,10);
            cpassword = await bcryptjs.hash(cpassword,10);
            const userRegister = new Userdata({
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                password,cpassword,
                address:req.body.address,
                resetToken:'',
                expireToken:''
            });
            const register = await userRegister.save();
            if(register){
                const userData = await Userdata.findOne({email:req.body.email});
                userID = userData._id;
            }
            // alert("Account Successfully Created");
            res.status(200).render('login',{
                Msg:"Account Successfully Created. Please Login",
            })

            // res.status(201).render('login',{
            //     userID
            // });
            
        }else{
            // alert("Password are not matching");
            res.status(200).render('login',{
                Msg:"Password are not matching",
            })
        }
        
    } catch (error) {
        // console.log(error);
        res.status(200).render('registration',{
            userID,
            Msg:"Account not created! Email already exists!!",
        })
    }
}

exports.postlogin = async (req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        let userData = '';

        if(validator.isEmail(username)){
            userData = await Userdata.findOne({email:username});
        }else{
            userData = await Userdata.findOne({phone:username});
        }
        
        if(userData != null){
            const isMatch = await bcryptjs.compare(password,userData.password);
            if(isMatch){
                const token = await userData.generateToken();
                userID = userData._id;

                res.cookie('token',token,{
                    expires:new Date(Date.now() + 86400000),
                    httpOnly:true
                });

                res.status(200).render('index',{
                    imagename:userData.profileImg,
                    name:userData.name,
                    emailID:userData.email,
                    phoneNo:userData.phone,
                    resetMsg:'',
                    Msg:'',
                    userID
                });
            }else{
                // alert('Enter a correct password');
                res.status(200).render('login',{
                    Msg:"Please Enter a correct password",
                })
            }
        }else{
            res.status(200).render('login',{
                Msg:"Please Enter a valid Email",
            })
        }
    }catch(error){
        res.status(500).send(error);
    }
}


const sendmail = async (email,subject,htmlText)=>{
    try {

        "use strict";
        const nodemailer = require("nodemailer");

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, 
            auth: {
            user: "kunarkrawat.cse24@jecrc.ac.in", 
            pass: "Kun#9470", 
            },
        });

        let info = await transporter.sendMail({
            from: '"Kunark" <kunarkrawat.cse24@jecrc.ac.in>', 
            to: email, 
            subject: subject, 
            html: htmlText, 
        });

        if(info.messageId){
            return "Sent";
        }else{
            return "Not Sent";
        }

    } catch (error) {
        async(req,res)=>{
            res.status(500).send(error);
        }
    }
}

exports.forgot_password = async(req,res)=>{
    res.status(200).render('forgot_password',{
        forgotpasswordMsg:''
    });
}

exports.forgot_sendmail = async(req,res)=>{
    const email = req.body.email;
    const userdata =  await Userdata.findOne({email});
    const token = await userdata.generateToken();
    userdata.resetToken = token;
    userdata.expireToken = Date.now() + 3600000;
    const user = await userdata.save();
    const subject = "Forgot Password Email"; 
    const htmlText = `<h4>Click in this <a href="http://localhost:8000/reset_password/${token}">link</a> to Reset your password.</h4>`;
    const result = await sendmail(user.email,subject,htmlText);



    if(result === 'Sent'){
        res.status(200).render('forgot_password',{
            forgotpasswordMsg:"Check your email for Forgot password",
        })
    }else{
        res.status(500).render('forgot_password',{
            forgotpasswordMsg:"Email not send due to server error",
        })
    }

}

exports.reset_password_mail = async (req,res)=>{
    try {
        
        const userdata =  await Userdata.findOne({_id:userID});
        const token = await userdata.generateToken();
        userdata.resetToken = token;
        userdata.expireToken = Date.now() + 3600000;
        const user = await userdata.save();

        const subject = "Reset Password Email"; 
        const htmlText = `<h4>Click in this <a href="http://localhost:8000/reset_password/${token}">link</a> to reset your password.</h4>`;
        const result = await sendmail(user.email,subject,htmlText);

        if(result === 'Sent'){
            res.status(200).render('index',{
                resetMsg:"Check your email for reset password",
                imagename:user.profileImg,
                name:user.name,
                emailID:user.email,
                phoneNo:user.phone,
                userID
            })
        }else{
            res.status(500).render('index',{
                resetMsg:"Email not send due to server error",
                imagename:user.profileImg,
                name:user.name,
                emailID:user.email,
                phoneNo:user.phone,
                userID
            })
        }
       
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.reset_password = async (req,res)=>{

    const senttoken = req.params.token;
    const user = await Userdata.findOne({resetToken:senttoken,expireToken:{$gt:Date.now()}});
    if(user){
        userID = user._id;
        res.status(200).render('reset_password',{
            userID
        });
    }else{
        res.status(422).send("Try again session expired");
    }
}

exports.post_reset_password = async (req,res)=>{
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const user = await Userdata.findOne({_id:userID});
    if(password === cpassword){
        user.password = await bcryptjs.hash(password,10);
        user.cpassword = await bcryptjs.hash(cpassword,10);
        user.resetToken = undefined;
        user.expireToken = undefined;
        const saveuser = await user.save();
        if(saveuser){
            alert("Password Reset Successfully");
            res.status(200).render('login',{
                userID
            });
        }


    }else{
        res.status(422).send("password are not same");
    }
}

exports.get_medicine = async(req,res)=>{
    res.status(200).render('medicine',{
        userID,
        Msg:''
    });
}
// exports.get_medicine = async (req,res)=>{
//     res.render('medicine',{
//         userID
//     });
// }
exports.post_medicine = async(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const address = req.body.address;
    const medicine = req.body.medicine;
    const expiry = req.body.date;
    const quantity = req.body.quantity;
    // const userdata =  await Userdata.findOne({email});
    // const token = await userdata.generateToken();
    // userdata.resetToken = token;
    // userdata.expireToken = Date.now() + 3600000;
    // const user = await userdata.save();
    const subject = "Donate -- HealthWell"; 
    const htmlText = `<h3>Thank You, for applying for donating Medicine. <br> Our delivery partner will collect the order if it costs more than ₹1000 otherwise you have to drop the package at one of our donation bins near you. <br> Details are -</h3> <h4>Name: ${name} <br> Email: ${email} <br> Address: ${address} <br> Medicine: ${medicine} <br> Expiry: ${expiry} <br> Quantity: ${quantity} <br><br></h4> <h5>With Regards <br> HealthWell</h5>`;
    const result = await sendmail(email,subject,htmlText);



    if(result === 'Sent'){
        res.status(200).render('medicine',{
            userID,
            Msg:"Thank You for Applying for Donating. You will shortly receive an email .",
        })
    }else{
        res.status(500).render('medicine',{
            userID,
            Msg:"Email not send due to server error",
        })
    }

}

exports.get_applience = async(req,res)=>{
    res.status(200).render('applience',{
        userID,
        Msg:''        
    });
}
// exports.get_applience = async (req,res)=>{
//     res.render('applience',{
//         userID
//     });
// }
exports.post_applience = async(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const address = req.body.address;
    const applience = req.body.applience;
    const dop = req.body.date;
    const brand = req.body.brand;
    // const userdata =  await Userdata.findOne({email});
    // const token = await userdata.generateToken();
    // userdata.resetToken = token;
    // userdata.expireToken = Date.now() + 3600000;
    // const user = await userdata.save();
    const subject = "Donate -- HealthWell"; 
    const htmlText = `<h3>Thank You, For Donating Appliances <br> Our delivery partner will collect the order if it costs more than ₹1000 otherwise you have to drop the package at one of our donation bins near you. <br> Details are -</h3> <h4>Name: ${name} <br> Email: ${email} <br> Address: ${address} <br> Name of Applience: ${applience} <br> Date of Production: ${dop} <br> Brand Name: ${brand} <br><br></h4> <h5>With Regards <br> HealthWell</h5>`;
    const result = await sendmail(email,subject,htmlText);



    if(result === 'Sent'){
        res.status(200).render('applience',{
            userID,
            Msg:"Thank You for Applying for Donating. You will shortly receive an email regarding it.",
        })
    }else{
        res.status(500).render('applience',{
            userID,
            Msg:"Email not send due to server error",
        })
    }

}

exports.get_money = async (req,res)=>{
    res.render('money',{
        userID
    });
}

exports.getdonation = async (req,res)=>{
    res.render('getdonation',{
        userID,
        Msg:''
    });
}

exports.post_getdonation = async (req,res)=>{
    // const user = Userdata.findOne({email:req.user.email});
    // res.render('index',{
    //     imagename:user.profileImg,
    //     name:user.name,
    //     emailID:user.email,
    //     phoneNo:user.phone,
    //     resetMsg:'',
    //     userID
    // });
    const name=req.body.name;
    const email=req.body.emails;
    const phone=req.body.phone;
    const address=req.body.address;
    const type=req.body.type;
    const quantity=req.body.quantity;
    const prescription=req.file.filename;
        
    const amRegister = new amdata({
        name:req.body.name,
        emails:req.body.emails,
        phone:req.body.phone,
        address:req.body.address,
        type:req.body.type,
        quantity:req.body.quantity,
        prescription:req.file.filename                
    });
    const register = await amRegister.save();
    // if(register){
    //     const amdata = await amdata.findOne({email:req.body.email});
    //     userID = amdata._id;
    // }
    alert("Applied Successfully for Medicines/Appliances");

    

    const subject = "Applied -- HealthWell"; 
    const htmlText = `<h3>Thank You, For Applying for Medicine/Appliances <br> Your request is in <u>pending</u>.<br> We'll contact you and deliver your requirements to you, after verifying your <u>prescription</u>. <br> Details are -</h3> <h4>Name: ${name} <br> Email: ${email} <br> Phone: ${phone}<br> Address: ${address} <br> Applied for: ${type} <br> Quantity: ${quantity} <br><br></h4> <h5>With Regards <br> HealthWell</h5>`;
    const result = await sendmail(email,subject,htmlText);



    if(result === 'Sent'){
        res.status(201).render('getdonation',{
            userID,
            Msg:'Applied Successfully for Medicines/Appliances'
        })
    }else{
        res.status(201).render('getdonation',{
            userID,
            Msg:'Email not send due to server error'
        });
    }
}

exports.newproducts = async (req,res)=>{
    res.render('newproducts',{
        userID
    });
}
exports.donatedproducts = async (req,res)=>{
    res.render('donatedproducts',{
        userID
    });
}
exports.about = async (req,res)=>{
    res.render('about',{
        userID
    });
}


exports.getlogout = async (req,res)=>{
    try {

        res.clearCookie('token');
        req.session.destroy();
        userID = '';

        res.render('login',{
            userID,
            Msg
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

