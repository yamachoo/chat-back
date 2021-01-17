import bcrypt from 'bcrypt'
import express from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import {
  createUser,
  readUsers
} from '../database/users'

const router = express.Router()

passport.use(new LocalStrategy({
  usernameField: 'email'
},
async (email, password, done) => {
  const users = await readUsers()
  const user = users.find(user => user.email === email)

  if (!user) {
    return done(null, false, { message: 'Incorrect email.' })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return done(null, false, { message: 'Incorrect password.' })
  }

  return done(null, user)
}
))
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user: Express.User, done) => {
  done(null, user)
})

router.post('/register',
  async (req, res) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10)
    }

    await createUser(user)

    res.send('Register success!')
  }
)

router.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    res.send('Login success!')
  }
)

router.get('/logout',
  (req, res) => {
    req.logout()
    res.send('Logout success!')
  }
)

export default router
