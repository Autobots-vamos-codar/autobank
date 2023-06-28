import express from 'express';
import AntiFraudController from '../controllers/AntiFraudController.js';

const antiFraudRoutes = express.Router();

antiFraudRoutes
  .get('/api/antiFraud', AntiFraudController.findAllAntiFraud)
  .get('/api/antiFraud/under-review', AntiFraudController.findAntiFraudUnderReview)
  .get('/api/antiFraud/:id', AntiFraudController.findAntiFraudById)

  .post('/api/antiFraud', AntiFraudController.createAntiFraud)
  .put('/api/antiFraud/:id', AntiFraudController.updateAntiFraud)
  .delete('/api/antiFraud/:id', AntiFraudController.deleteAntiFraud);

export default antiFraudRoutes;
