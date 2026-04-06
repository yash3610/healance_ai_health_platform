import express from 'express';
import {
  predictDiabetes,
  predictHeart,
  predictAll,
  predictSymptomsDisease,
  getSymptomsPredictionHistory,
  sharePredictionOnWhatsApp,
  shareSymptomsPredictionOnWhatsApp,
} from '../controllers/predictController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/diabetes', predictDiabetes);
router.post('/heart', predictHeart);
router.post('/all', predictAll);
router.post('/symptoms-disease', predictSymptomsDisease);
router.get('/symptoms-history', getSymptomsPredictionHistory);
router.post('/share-whatsapp', sharePredictionOnWhatsApp);
router.post('/share-symptoms-whatsapp', shareSymptomsPredictionOnWhatsApp);

export default router;
