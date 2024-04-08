const express = require('express');
const router = express.Router();
const authController = require(`../controllers/authController`)

router.route('/register').post(authController.signUp);
router.route('/login').post(authController.signIn);

module.exports = router;