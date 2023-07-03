import express from 'express';
import { local } from '../middleware/autenticationMiddleware.js';
import AccountController from '../controllers/AccountsController.js';

const router = express.Router();

router
  .post('/api/admin/accounts', AccountController.createAccount)
  .post('/api/accounts/login', local, AccountController.login);

export default router;
