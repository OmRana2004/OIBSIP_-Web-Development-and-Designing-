const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        // Login
        // check if email exist
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'No user with this email' });
        }

        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, { message: 'Logged in successfully' });
            }
            return done(null, false, { message: 'Wrong details' });
        }).catch(err => {
            return done(null, false, { message: 'Something Went Wrong' });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });
    });
}

module.exports = init;
