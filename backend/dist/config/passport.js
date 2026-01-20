"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_apple_1 = require("passport-apple");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
// Google Strategy - Only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User_1.User.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            }
            user = await User_1.User.findOne({ email: profile.emails[0].value });
            if (user) {
                user.googleId = profile.id;
                user.avatar = profile.photos[0].value;
                user.isEmailVerified = true;
                await user.save();
                return done(null, user);
            }
            const newUser = new User_1.User({
                googleId: profile.id,
                email: profile.emails[0].value,
                username: profile.emails[0].value.split('@')[0],
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                avatar: profile.photos[0].value,
                isEmailVerified: true
            });
            await newUser.save();
            done(null, newUser);
        }
        catch (error) {
            done(error, undefined);
        }
    }));
}
else {
    console.log('⚠️  Google OAuth not configured - skipping Google strategy');
}
// Apple Strategy - Only initialize if credentials are provided
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID) {
    passport_1.default.use(new passport_apple_1.Strategy({
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyPath: process.env.APPLE_PRIVATE_KEY_PATH,
        callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:5000/api/auth/apple/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User_1.User.findOne({ appleId: profile.id });
            if (user) {
                return done(null, user);
            }
            if (profile.email) {
                user = await User_1.User.findOne({ email: profile.email });
                if (user) {
                    user.appleId = profile.id;
                    user.isEmailVerified = true;
                    await user.save();
                    return done(null, user);
                }
            }
            const newUser = new User_1.User({
                appleId: profile.id,
                email: profile.email || `${profile.id}@privaterelay.appleid.com`,
                username: `apple_user_${profile.id.slice(-8)}`,
                firstName: profile.name?.firstName,
                lastName: profile.name?.lastName,
                isEmailVerified: true
            });
            await newUser.save();
            done(null, newUser);
        }
        catch (error) {
            done(error, undefined);
        }
    }));
}
else {
    console.log('⚠️  Apple OAuth not configured - skipping Apple strategy');
}
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        if (!user.password) {
            return done(null, false, { message: 'Please use social login or set a password' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        user.lastLogin = new Date();
        await user.save();
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
}));
//# sourceMappingURL=passport.js.map