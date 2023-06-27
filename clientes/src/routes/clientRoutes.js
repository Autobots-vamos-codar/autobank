import express from 'express';
import ClienteController from '../controllers/ClienteController.js';

const router = express.Router();

router
  .get('/api/admin/Client/:id', ClienteController.getUserDataWithoutAccount);

export default router;
