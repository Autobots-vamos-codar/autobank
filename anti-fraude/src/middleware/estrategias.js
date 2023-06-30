/* eslint-disable quote-props */
import passport from 'passport';
import LocalStrategy from 'passport-local';
import BearerStrategy from 'passport-http-bearer';

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Account from '../models/Account.js';

function verifyPassword(senha, senhaHash) {
  const senhaValida = bcryptjs.compareSync(senha, senhaHash);
  if (!senhaValida) {
    return false;
  }

  return true;
}

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'senha',
    session: false,
  }, async (email, senha, done) => {
    const findAccount = await Account.findOne({ 'email': email });
    
    if (!findAccount) {
      return done(null, false);
    }
    if (!verifyPassword(senha, findAccount.senha)) {
      return done(null, false);
    }

    return done(null, findAccount);
  }),
);

passport.use(
  new BearerStrategy(
    async (token, done) => {
      try {
        const payload = jwt.verify(token, process.env.CHAVE_JWT);
        const usuario = await Account.findById(payload.id);
        done(null, usuario, { scope: 'all' });
      } catch (erro) {
        console.log(erro);
        done(erro);
      }
    },
  ),
);

export default passport;
