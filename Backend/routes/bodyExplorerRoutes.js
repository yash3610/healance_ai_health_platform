import express from 'express';
import { getAllBodyParts, getBodyPartInfo } from '../controllers/bodyExplorerController.js';

const router = express.Router();

router.get('/', getAllBodyParts);
router.get('/:partName', getBodyPartInfo);

export default router;
