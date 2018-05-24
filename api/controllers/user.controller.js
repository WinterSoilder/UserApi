var mongoose = require('mongoose');
var User = mongoose.model('User');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var bcrypt = require('bcryptjs');

module.exports.userGetAll = function (req, res) {
  console.log('GET the user');
  console.log(req.query);

  User
    .find()
    .exec(function (err, user) {
      console.log(err);
      console.log(user);
      if (err) {
        console.log("Error finding user");
        res
          .status(500)
          .json(err);
      } else {
        console.log("Found user", user.length);
        res
          .json(user);
      }
    });

};

module.exports.userGetOne = function (req, res) {
  var id = req.params.userId;

  console.log('GET userId', id);

  User
    .findById(id)
    .exec(function (err, doc) {
      var response = {
        status: 200,
        message: doc
      };
      if (err) {
        console.log("Error finding User");
        response.status = 500;
        response.message = err;
      } else if (!doc) {
        console.log("userId not found in database", id);
        response.status = 404;
        response.message = {
          "message": "User ID not found " + id
        };
      }
      res
        .status(response.status)
        .json(response.message);
    });

};

module.exports.userGetOneByEmail = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
console.log(email, password)
  User.find({ email: email,password:password }, function(err, user){
    if (err) {
      res.json( { 'message': 'Error User' })
      console.log(err)
    };
    if (!user) {
      res.json( { 'message': 'Unknown User' })
    }else{
      res.json(user)
    }
  })
}

module.exports.userAddOne = function (req, res) {
  console.log("POST new User");

  var newUser = new User({
    firstName: req.body.firstName,
    lastName:req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    company: req.body.company,
    address:req.body.address,
    phone:req.body.phone
  });
  newUser.save(function (err, user) {
    if (err)throw new err
    console.log(user);
    res.status(200);
    res.json(user)
  });

};

module.exports.userForgot = function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.json({'error':'No account with that email address exists.'});
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'shashankvmadan123@gmail.com',
          pass: 'railway1999'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'shashankvmadan123@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:4200//#/pages/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        res.json({'success':'msg has been sent'});
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};


module.exports.userReset = function(req, res) {
  async.waterfall([
    function(done) {
      console.log(req.params.token)
      User.find({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          console.log('user not fount')
        }else{
          var password = req.body.password
          var password = req.body.password
          console.log(password)
          // update it with hash
          // bcrypt.hash(password, (hash) => {
          //   req.body.password = hash
          //   console.log('bcrypt'+req.body.password);
          //   // then update
            // User.update({"email": "samdepp74@gmail.com"},{
            //     $set: {
            //       "password": req.body.password
            //     }
            //   })  
            //   console.log('done')       
            //  });     
          // user.firstName =user.firstName;
          // user.lastName = user.lastName;
          // user.email =user.email;
          // user.company =user.company;

          user = new User();
          user.email = req.body.email;
          user.password = password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save(function(err, doc) {
             if(err){
              console.log(err);
             } else{
               console.log('success')
             }
          });
  
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'shashankvmadan123@gmail.com',
          pass: 'railway1999'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'shashankvmadan123@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        res.json({'success': 'Success! Your password has been changed.'});
        done(err);
      });
    }
  ], function(err) {
    console.log(err);
  });
};
module.exports.userUpdateOne = function (req, res) {
  var userId = req.params.userId;

  console.log('GET userId', userId);

  User
    .findById(userId)
    .exec(function (err, User) {
      if (err) {
        console.log("Error finding User");
        res
          .status(500)
          .json(err);
        return;
      } else if (!User) {
        console.log("userId not found in database", userId);
        res
          .status(404)
          .json({
            "message": "User ID not found " + userId
          });
        return;
      }

      User.firstName = req.body.firstName;
      User.lastName = req.body.lastName;
      User.userName = req.body.userName;
      User.password = req.body.password;

      User
        .save(function (err, studentUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json(studentUpdated);
          }
        });


    });

};

module.exports.userDeleteOne = function (req, res) {
  var userId = req.params.userId;

  User
    .findByIdAndRemove(userId)
    .exec(function (err, studentDeleted) {
      if (err) {
        res
          .status(404)
          .json(err);
      } else {
        console.log("student deleted", userId)
        res
          .status(204)
          .json();
      }
    });
};