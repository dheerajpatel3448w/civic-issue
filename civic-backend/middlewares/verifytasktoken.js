// middleware/verifyTaskToken.js
import jwt from 'jsonwebtoken';
import Complaint from '../models/complaint.model.js';

export default async function verifyTaskToken(req, res, next) {
  try {
    const token = req.query.token || req.headers['x-task-token'];
    if (!token) return res.status(401).json({ error: 'Token required' });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const taskId = payload.taskId;
    if (!taskId) return res.status(401).json({ error: 'Invalid token payload' });

    // Optional: ensure token matches route param
    if (req.params.taskId && req.params.taskId !== taskId) {
      return res.status(403).json({ error: 'Token/Task mismatch' });
    }

    const complaint = await Complaint.findById(taskId).lean();
    if (!complaint) return res.status(404).json({ error: 'Task not found' });

    // Attach to req for handlers
    req.task = complaint;
    req.taskIdFromToken = taskId;
    next();
  } catch (err) {
    console.error('verifyTaskToken error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
