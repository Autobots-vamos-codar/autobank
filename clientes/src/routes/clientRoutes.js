import express from 'express';
import { bearer, local } from '../middleware/autenticationMiddleware.js';
import ClienteController from '../controllers/ClienteController.js';

const router = express.Router();

router
  .get('/api/admin/clients/:id', bearer, ClienteController.getUserDataWithoutAccount)
  .post('/api/admin/clients', local, ClienteController.validDataAtDatabase);

export default router;
