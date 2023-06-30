import express from 'express';
import passport from '../middlware/estrategias.js';
import ClienteController from '../controllers/ClienteController.js';

const router = express.Router();

router
  .get('/api/admin/clients/:id', passport.authenticate('bearer', { session: false }), ClienteController.getUserDataWithoutAccount)
  .post('/api/admin/clients', passport.authenticate('bearer', { session: false }), ClienteController.validDataAtDatabase);

export default router;
