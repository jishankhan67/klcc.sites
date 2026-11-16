import { Router } from 'express';
import {
  sendMessage,
  getConversations,
  getMessages,
  deleteConversation,
} from '../controllers/chatController';

const router = Router();

router.post('/message', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId/messages', getMessages);
router.delete('/conversations/:conversationId', deleteConversation);

export default router;