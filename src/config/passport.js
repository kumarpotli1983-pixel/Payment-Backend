import passport from "passport"
import GoogleStrategy from "passport-google-oauth20"
import { User } from "../models/user.model.js"
import { sendWelcomeEmail } from "../services/email.service.js"

passport.use(new GoogleStrategy({
  clientID:process.env.LOGIN_CLIENT_ID,
  clientSecret:process.env.LOGIN_CLIENT_SECRET,
  callbackURL:"/api/v2/auth/google/callback"
},
  async(accessToken, refreshToken, profile, done)=>{
    
    const email = profile.emails[0].value
    const user = await User.findOne({email})

    try {
      if(!user)
        {
          const user = await User.create({
            email,
            name:profile.displayName,
            verifiedUser:true,
            authProvider:"Google"
          })

          await sendWelcomeEmail(user.email,user.name)

          return done(null, user)
        }

      return done(null, user)
    } catch (error) {
      return done(error, null)
    }    
}
))

passport.serializeUser((user, done)=>{
  return done(null, user._id)
})

passport.deserializeUser(async(id, done)=>{
  try {

    const user = await User.findOne({id})
    return done(null, user)

  } catch (error) {
    return done(error, null)
  }
})

export default passport