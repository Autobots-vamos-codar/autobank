import express from 'express';
import ClienteController from '../controllers/ClienteController.js';

const router = express.Router();

router
  .get('/api/admin/clients/:id', ClienteController.getUserDataWithoutAccount)
  .post('/api/admin/clients', ClienteController.createClient)
  .post('/api/admin/card', ClienteController.validDataAtDatabase);

export default router;
