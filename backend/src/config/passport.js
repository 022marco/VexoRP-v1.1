const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔍 Discord profile:', profile.username);
    
    let user = await User.findOne({ discordId: profile.id });
    
    if (!user) {
      user = new User({
        discordId: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar,
        email: profile.email,
        role: 'pending',
        whitelistStatus: 'pending'
      });
      await user.save();
      console.log('✅ Nuevo usuario VEXO:', user.username);
    }
    
    done(null, user);
  } catch (error) {
    console.error('❌ Error en Discord auth:', error);
    done(error, null);
  }
}));

module.exports = passport;