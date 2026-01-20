import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as AppleStrategy } from 'passport-apple'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import { User } from '../models/User'

passport.serializeUser((user: any, done: any) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

// Google Strategy - Only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      let user = await User.findOne({ googleId: profile.id })
      
      if (user) {
        return done(null, user)
      }
      
      user = await User.findOne({ email: profile.emails![0].value })
      
      if (user) {
        user.googleId = profile.id
        user.avatar = profile.photos![0].value
        user.isEmailVerified = true
        await user.save()
        return done(null, user)
      }
      
      const newUser = new User({
        googleId: profile.id,
        email: profile.emails![0].value,
        username: profile.emails![0].value.split('@')[0],
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        avatar: profile.photos![0].value,
        isEmailVerified: true
      })
      
      await newUser.save()
      done(null, newUser)
    } catch (error) {
      done(error, undefined)
    }
  }))
} else {
  console.log('⚠️  Google OAuth not configured - skipping Google strategy')
}

// Apple Strategy - Only initialize if credentials are provided
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID) {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID!,
    privateKeyPath: process.env.APPLE_PRIVATE_KEY_PATH!,
    callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:5000/api/auth/apple/callback',
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      let user = await User.findOne({ appleId: profile.id })
      
      if (user) {
        return done(null, user)
      }
      
      if (profile.email) {
        user = await User.findOne({ email: profile.email })
        
        if (user) {
          user.appleId = profile.id
          user.isEmailVerified = true
          await user.save()
          return done(null, user)
        }
      }
      
      const newUser = new User({
        appleId: profile.id,
        email: profile.email || `${profile.id}@privaterelay.appleid.com`,
        username: `apple_user_${profile.id.slice(-8)}`,
        firstName: profile.name?.firstName,
        lastName: profile.name?.lastName,
        isEmailVerified: true
      })
      
      await newUser.save()
      done(null, newUser)
    } catch (error) {
      done(error, undefined)
    }
  }))
} else {
  console.log('⚠️  Apple OAuth not configured - skipping Apple strategy')
}

// Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email: any, password: any, done: any) => {
  try {
    const user = await User.findOne({ email })
    
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' })
    }
    
    if (!user.password) {
      return done(null, false, { message: 'Please use social login or set a password' })
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
      return done(null, false, { message: 'Invalid email or password' })
    }
    
    user.lastLogin = new Date()
    await user.save()
    
    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))

export { passport }
