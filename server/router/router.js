const express = require('express');
const router = new express.Router();
const controller = require('../controller/controller');
const upload = require('../middleware/multer');
const auth = require('../middleware/auth');
// router.get('/',auth,controller.gethome);
router.get('/',controller.gethome);
// router.get('/');

// router.get('/register',controller.getregister);

router.get('/login',controller.getlogin);

router.get('/reset_password_mail',controller.reset_password_mail);

// router.post('/register',upload,controller.postregister);

router.post('/login',controller.postlogin);

router.get('/logout',auth,controller.getlogout);

router.get('/reset_password/:token',controller.reset_password);

router.post('/reset_password',controller.post_reset_password);

router.get('/forgot_password',controller.forgot_password);

router.post('/forgot_sendmail',controller.forgot_sendmail);

router.get('/getdonation',auth,controller.getdonation);
router.post('/getdonation',upload,controller.post_getdonation);

router.get('/medicine',auth,controller.get_medicine);
router.post('/medicine',controller.post_medicine);

router.get('/applience',auth,controller.get_applience);
router.post('/applience',controller.post_applience);

router.get('/money',auth,controller.get_money);
// router.post('/money',controller.post_money);


router.get('/newproducts',controller.newproducts);
router.get('/donatedproducts',controller.donatedproducts);
router.get('/about',controller.about);

router.get('/registration',controller.registration);
router.post('/registration',controller.postregister);


module.exports = router;