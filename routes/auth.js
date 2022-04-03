const express = require('express');
//check fx that we can import later
const { check, body } = require('express-validator/check');//check package

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get('/userdash', authController.getUserDash);
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);

router.post(
    '/login',
    [
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
      body('password', 'Password has to be valid.')
        .isLength({ min: 4 })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin
  );

  router.post(
    '/register',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .custom((value, { req }) => {
                // if (value === 'test@test.com') {
                //   throw new Error('This email address if forbidden.');
                // }
                // return true;
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-Mail exists already, please pick a different one.'
                        );
                    }
                });
            })
            .normalizeEmail(),
        body('password',
            'Please enter a password with only numbers and text and at least 5 characters.'
        )
            .isLength({ min: 4 })
            .isAlphanumeric()
            .trim(),
        body('name', 'Enter a name, just alpha characters.')
            .isAlpha()
            .trim(),
        body('lname', 'Enter a lastname, just alpha characters.')
             .isAlpha()
            .trim(),
        body('confirmPassword')
            .trim() // To delete leading and triling space 
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
    ],
    authController.postRegister
);
router.get('/auth/user-edit', authController.getUserEdit);
router.post('/auth/user-edit', authController.postUserEdit);

router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
