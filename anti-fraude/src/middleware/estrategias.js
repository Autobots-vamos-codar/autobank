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
        const chaveJWTDev = 'Re7jpi9szEyUO02CbaHgarVyYq2N/HEXG/MWGmJAYN8E26IdcsyHvYEdhd7b7DV1SCj5GWdFbZ0Nla1cnZDrJQNrKbRQ6JvNymXYklHpPdRSkfweRRfoWPu9PUxksDQdcjDS7gvIs81Ta+qt82eLkSYOLhJK6KSnzzY+0GBdv04bHwC95Rpkk3cyc9uG5HSxYM/ekJW/T03+VZJS56DGxiVq5/6FSr8C+MtHhZ0s669b4Sek24c2Lq3DduHlNX3D2WLsWuWDvzeIQzskBd9Aq7lLHTacD7bzgsa4mCCncgfRFDAnR6+NBTA44Eb2sYxeN5alJfCmbTm62EzXy6MEKA==';
        const payload = jwt.verify(token, process.env.CHAVE_JWT || chaveJWTDev);
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
