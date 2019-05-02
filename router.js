const express = require('express');
const router = express.Router();
const User = require('./models/user');
const passport = require('passport');


router.get('/', (req, res, next) => {
    res.render('index', { title: 'Index' });
})

router.get('/dashboard', (req, res, next) => {
    res.render('dashboard', { title: 'Dashboard' });
})

router.get('/add', (req, res, next) => {
    res.render('add', { title: 'Add a new note' });
})

router.get('/edit', (req, res, next) => {
    res.render('edit', { title: 'Edit note' });
})

router.post('/add', (req, res, next) => {
    res.status(200).json({
        data: req.body
    })
})

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
        res.redirect('/dashboard');
        // res.json({
        //     success: true,
        //     status: 'You are successfully logged in!'
        // });
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
            users: users
        });
    }).catch(err => {
        res.status(500).json({
            message: `Internal server error.`,
            status: 500
        });
        return next();

    });
})

router.post('/send_friend_request/:username', (req, res, next) => {
    User.findOne({
        username: req.params.username
    }).then(user => {
        var loggedUser = req.session.passport.user;
        User.findOne({
            username: loggedUser
        }).then(userSender => {
            userSender.friendRequest(user._id, (err, request) => {
                if (err) {
                    throw err;
                }

                console.log(request);

                res.status(200).json({
                    message: "Succesfully sent friend request!",
                    status: 200,
                    request: request
                });

            })
        })
    }).catch(err => {
        res.status(500).json({
            message: `Internal server error.`,
            status: 500
        });
        return next();

    });
})

router.get('/get_friends_request', (req, res, next) => {
    var loggedUser = req.session.passport.user;
    User.findOne({
        username: loggedUser
    }).then(user => {
        user.getRequests((err, requests) => {
            if (err) {
                throw err;
            }
            res.status(200).json({
                message: "Succesfully sent list of friend requests!",
                status: 200,
                requests: requests
            });
        })
    })
})

router.post('/accept_friend_request/:username', (req, res, next) => {
    User.findOne({
        username: req.params.username
    }).then(user => {
        var loggedUser = req.session.passport.user;
        User.findOne({
            username: loggedUser
        }).then(userSender => {
            userSender.acceptRequest(user._id, (err, request) => {
                if (err) {
                    throw err;
                }

                console.log(request);

                res.status(200).json({
                    message: "Succesfully accepted friend request!",
                    status: 200,
                    request: request
                });

            })
        })
    }).catch(err => {
        res.status(500).json({
            message: `Internal server error.`,
            status: 500
        });
        return next();

    });
})

router.post('/deny_friend_request/:username', (req, res, next) => {
    User.findOne({
        username: req.params.username
    }).then(user => {
        var loggedUser = req.session.passport.user;
        User.findOne({
            username: loggedUser
        }).then(userSender => {
            userSender.denyRequest(user._id, (err, request) => {
                if (err) {
                    throw err;
                }

                res.status(200).json({
                    message: "Succesfully denied friend request!",
                    status: 200,
                    request: request
                });

            })
        })
    }).catch(err => {
        res.status(500).json({
            message: `Internal server error.`,
            status: 500
        });
        return next();

    });
})

router.post('/end_friendship/:username', (req, res, next) => {
    User.findOne({
        username: req.params.username
    }).then(user => {
        var loggedUser = req.session.passport.user;
        User.findOne({
            username: loggedUser
        }).then(userSender => {
            userSender.endFriendship(user._id, (err, request) => {
                if (err) {
                    throw err;
                }

                console.log(request);

                res.status(200).json({
                    message: "Succesfully ended friendship!",
                    status: 200,
                    request: request
                });

            })
        })
    }).catch(err => {
        res.status(500).json({
            message: `Internal server error.`,
            status: 500
        });
        return next();

    });
})

router.get('/get_friends', (req, res, next) => {
    User.findOne({
        username: req.session.passport.user
    }).then(user => {
        user.getFriends((err, friends) => {
            if (err) {
                throw err;
            }

            res.status(200).json({
                message: "Succesfully got all friends!",
                status: 200,
                friends: friends
            });


        })
    })
})

router.post('/post-note', (req, res, next) => {

})

router.get('/get-note', (req, res, next) => {

})

router.get('/get-friends-notes', (req, res, next) => {
    User.findOne({
        username: req.session.passport.user
    }).then(user => {
        user.getFriends((err, friends) => {
            if (err) {
                throw err;
            }

            var friendsUsernames = [];
            friends.forEach(element => {
                friendsUsernames.push(element.username)
            });

            res.status(200).json({
                message: "Succesfully got all friends notes!",
                status: 200,
                friends: friendsUsernames
            });


        })
    })
})


module.exports = router;