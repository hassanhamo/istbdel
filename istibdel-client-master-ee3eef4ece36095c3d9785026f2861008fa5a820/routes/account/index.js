var express = require('express');
var router = express.Router();
var passport = require('passport');
var Parse = require('parse/node');





router.get('/login', function (req, res, next) {
    if (req.user){
        return res.redirect('/');
    }
    res.render('account/login');
});

router.get('/currentUser', function (req, res, next) {
     res.json(req.user);
});

router.post('/login', function (req, res, next) {
    var body =req.body;
    console.log(body);
    var query= new Parse.Query('_User');
    query.equalTo('username',body.username)
    .first().then(function(user){
        if(user){
            req.logIn(user, function (err) {
            if (err) {
                 res.status(400).json({ error: 'حدث خطأ غير متوقع' });
            }

             res.json({
                user: req.user,
                redirectTo: '/'
            });
        });
            
        }
        else{
                 res.status(400).json({ error: 'رقم الهاتف  خاطئ' }); 
            }

    },function(error){
res.status(400).json({ error: 'رقم الهاتف خاطئ' });
    })
   /* passport.authenticate('parse', function (err, user, info) {
        if (err) {
            return res.status(400).json({ error: 'رقم الهاتف أو كلمة المرور خاطئة' });
        }

        if (!user) {
            return res.status(400).json({ error: 'رقم الهاتف أو كلمة المرور خاطئة' });
        }

        req.logIn(user, function (err) {
            if (err) {
                return res.status(400).json({ error: 'حدث خطأ غير متوقع' });
            }

            return res.json({
                user: req.user,
                redirectTo: '/'
            });
        });
    })(req, res);*/
    /* Parse.User.logIn(body.username, body.password).then(function (user) {
        res.json(user);
     },function(error){
        res.status(400);
        res.json(error);
     });*/
});

router.get('/logout', function (req, res, next) {
    req.logout();
    res.render('account/login');
     /* res.json({
                redirectTo: '/account/login'
            }); */
});

module.exports = router;
