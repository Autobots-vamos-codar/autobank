import express from 'express';
import AntiFraudController from '../controllers/AntiFraudController.js';
import { bearer } from '../middleware/autenticationMiddleware.js';

const antiFraudRoutes = express.Router();

antiFraudRoutes
  .get('/api/antiFraud', bearer, AntiFraudController.findAllAntiFraud)
  .get('/api/antiFraud/under-review', bearer, AntiFraudController.findAntiFraudUnderReview)
  .get('/api/antiFraud/:id', bearer, AntiFraudController.findAntiFraudById)
  .post('/api/antiFraud', AntiFraudController.createAntiFraud)
  .patch('/api/antiFraud/:id', bearer, AntiFraudController.updateAntiFraud)
  .delete('/api/antiFraud/:id', bearer, AntiFraudController.deleteAntiFraud);

export default antiFraudRoutes;
