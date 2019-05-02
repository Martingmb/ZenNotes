const express = require('express');
const router = express.Router();
const User = require('./models/user');
const passport = require('passport');

router.post('/signup', (req, res, next) => {
    User.register(new User({
            username: req.body.username
        }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    err: err
                });
            } else {
                passport.authenticate('local')(req, res, () => {
                    User.findOne({
                        username: req.body.username
                    }, (err, person) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            success: true,
                            status: 'Registration Successful!',
                        });
                    });
                })
            }
        })
});


router.post('/login', passport.authenticate('local'), (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err, person) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: true,
            status: 'You are successfully logged in!'
        });
    })
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.logout();
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.clearCookie('session-id');
                res.json({
                    message: 'You are successfully logged out!'
                });
            }
        });
    } else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});


router.post('/search_user/:username', (req, res, next) => {
    User.find({
        username: req.params.username
    }).then(users => {
        res.status(200).json({
            message: "Succesfully sent the list of users",
            status: 200,
            posts: users
        });
    }).catch(err => {
        res.status(500).json({
            message: `Internal server error.`,
            status: 500
        });
        return next();

    });
})


module.exports = router;