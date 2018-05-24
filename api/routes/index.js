var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var ctrlUser = require('../controllers/user.controller.js');
// routes
router
  .route('/user')
  .get(ctrlUser.userGetAll)
  .post(ctrlUser.userAddOne)
  router
  .route('/user/:userId')
  .delete(ctrlUser.userDeleteOne);

router
  .route('/userLogin')
  .post(ctrlUser.userGetOneByEmail)
router
  .route('/forgot')
  .post(ctrlUser.userForgot)

router
  .route('/reset/:token')
  .post(ctrlUser.userReset)
module.exports = router;