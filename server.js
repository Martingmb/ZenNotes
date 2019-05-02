const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/user');
const router = require('./router');
const { DATABASE_URL, PORT } = require('./config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

app.use(jsonParser);

app.use(session({
    name: 'session-id',
    secret: '123-456-789',
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('', router);

let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl,
            err => {
                if (err) {
                    return reject(err);
                } else {
                    server = app.listen(port, () => {
                            console.log('Your app is running in port ', port);
                            resolve();
                        })
                        .on('error', err => {
                            mongoose.disconnect();
                            return reject(err);
                        });
                }
            }
        );
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
}

runServer(PORT, DATABASE_URL)
    .catch(err => console.log(err));

module.exports = { app, runServer, closeServer };