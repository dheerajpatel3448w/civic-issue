// routes/tasks.js
import express from 'express';
import { getTaskDetails, postUploadProof } from '../controllers/task.controller.js';
const router7 = express.Router();

// Public route (protected by token query param inside middleware)
router7.get('/:taskId', getTaskDetails);
router7.post('/:taskId/upload', postUploadProof);

// Officer assign route


export default router7;
