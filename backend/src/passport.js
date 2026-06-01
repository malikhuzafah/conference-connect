require("dotenv").config();
const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ["openid", "profile", "email"],
      state: true,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.email,
        photo: profile.picture,
      };
      console.log("LinkedIn profile:", profile.picture);
      return done(null, user);
    },
  ),
);

module.exports = passport;
