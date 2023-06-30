import express from 'express';
import passport from 'passport';
import AccountController from '../controllers/AccountsController.js';
// import token from '../middlware/tokenteste.js';

const router = express.Router();

router
  .get('/api/admin/accounts', AccountController.findAccounts)
  .get('/api/admin/accounts/:id', AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .post('/api/accounts/login', passport.authenticate('local', { failureRedirect: '/login' }), AccountController.login)
  .put('/api/admin/accounts/:id', AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', AccountController.deleteAccount);

export default router;
