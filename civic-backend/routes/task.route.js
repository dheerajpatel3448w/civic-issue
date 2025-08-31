// routes/tasks.js
import express from 'express';
import { getTaskDetails, postUploadProof, assignAndNotify } from '../controllers/task.controller.js';
const router = express.Router();

// Public route (protected by token query param inside middleware)
router.get('/:taskId', getTaskDetails);
router.post('/:taskId/upload', postUploadProof);

// Officer assign route


export default router;
