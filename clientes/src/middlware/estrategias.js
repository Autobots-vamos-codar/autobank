import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Account from '../models/Account';

// function verificaUsuario(usuario) {
//   if (!usuario) {
//     throw new InvalidArgumentError('Não existe usuário com esse e-mail!');
//   }
// }

async function verifyPassword(senha, senhaHash) {
  const senhaValida = await bcryptjs.compare(senha, senhaHash);
  if (!senhaValida) {
    throw new Error('E-mail ou senha inválidos!');
  }

  return true;
}

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'senha',
    session: false,
  }, async (email, senha, done) => {
    Account.findOne({ 'email': email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!verifyPassword(senha, user.senha)) { return done(null, false); }
      return done(null, user);
    });
  }),
);

// passport.use(
//   new BearerStrategy(
//     async (token, done) => {
//       try {
//         await verificaTokenNaBlacklist(token);
//         const payload = jwt.verify(token, process.env.CHAVE_JWT);
//         const usuario = await Usuario.buscaPorId(payload.id);
//         done(null, usuario, { token });
//       } catch (erro) {
//         done(erro);
//       }
//     },
//   ),
// );
