import express from 'express';
import {
  updateProfile,
  updatePassword,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  toggleBookmark,
  getBookmarks,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.get('/notifications', getNotifications);
router.put('/notifications/read-all', markAllNotificationsRead);
router.put('/notifications/:id/read', markNotificationRead);
router.post('/bookmarks/:blogId', toggleBookmark);
router.get('/bookmarks', getBookmarks);

export default router;
