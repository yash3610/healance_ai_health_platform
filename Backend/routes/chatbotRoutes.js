import express from 'express';
import { sendMessage, getChatSessions, getSessionMessages, deleteSession } from '../controllers/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/message', sendMessage);
router.get('/sessions', getChatSessions);
router.get('/sessions/:sessionId', getSessionMessages);
router.delete('/sessions/:sessionId', deleteSession);

export default router;
