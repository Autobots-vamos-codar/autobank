import express from 'express';
import AntiFraudController from '../controllers/AntiFraudController.js';
import { bearer } from '../middleware/autenticationMiddleware.js';

const antiFraudRoutes = express.Router();

antiFraudRoutes
  .get('/api/antiFraud', AntiFraudController.findAllAntiFraud)
  .get('/api/antiFraud/under-review', AntiFraudController.findAntiFraudUnderReview)
  .get('/api/antiFraud/:id', AntiFraudController.findAntiFraudById)
  .post('/api/antiFraud', AntiFraudController.createAntiFraud)
  .patch('/api/antiFraud/:id', bearer, AntiFraudController.updateAntiFraud)
  .delete('/api/antiFraud/:id', AntiFraudController.deleteAntiFraud);

export default antiFraudRoutes;
