import express from 'express';
import {
  predictDiabetes,
  predictHeart,
  predictAll,
  sharePredictionOnWhatsApp,
} from '../controllers/predictController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/diabetes', predictDiabetes);
router.post('/heart', predictHeart);
router.post('/all', predictAll);
router.post('/share-whatsapp', sharePredictionOnWhatsApp);

export default router;
