import express from 'express';
import AntiFraudController from '../controllers/AntiFraudController.js';

const router = express.Router();

router
  .get('/api/antiFraud', AntiFraudController.findAllAntiFraud)
  .get('/api/antiFraud/:id', AntiFraudController.findAntiFraudById)
  .get('/api/antiFraud/under-review', AntiFraudController.findAnalysisUnderReview)
  .post('/api/antiFraud', AntiFraudController.createAntiFraud)
  .put('/api/antiFraud/:id', AntiFraudController.updateAntiFraud)
  .delete('/api/antiFraud/:id', AntiFraudController.deleteAntiFraud);

export default router;
