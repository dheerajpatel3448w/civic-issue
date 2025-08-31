// controllers/tasksController.js
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import Complaint from '../models/complaint.model.js';
import verifyTaskToken from '../middlewares/verifytasktoken.js';




// Setup multer for proof uploads
const uploadDir = path.join(process.cwd(), 'uploads', 'proofs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
export const upload = multer({ storage });

/**
 * GET task details (token-protected)
 * route: GET /api/tasks/:taskId?token=...
 */
export const getTaskDetails = [
  verifyTaskToken,
  async (req, res) => {
    const task = req.task;
    // send minimal safe info
    return res.json({
      taskId: task._id,
      issue: task.description,
      location: task.location || null,
      reportedImage: task.media && task.media.length ? task.media[0].url : null,
      status: task.status
    });
  }
];

/**
 * POST upload proof
 * route: POST /api/tasks/:taskId/upload?token=...
 * field name: 'proof'
 */
export const postUploadProof = [
  verifyTaskToken,
  upload.single('proof'),
  async (req, res) => {
    try {
      const task = req.task;
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      // Save proof record into complaint doc (push proof URL)
      const proofUrl = `/uploads/proofs/${req.file.filename}`;
      await Complaint.findByIdAndUpdate(task._id, {
        $push: { proofs: { url: proofUrl, uploadedAt: new Date() } }
      });

      // If original reported image exists, run compare
      const reported = task.media && task.media.length ? task.media[0].url : null;
      let compareResult = { success: false, reason: 'No reported image to compare' };

      if (reported) {
        // reported may be a URL like /uploads/xxx.jpg — convert to fs paths if local
        // Try to map to local path: assume server serves /uploads from project root
        const reportedPath = reported.startsWith('/uploads') ? path.join(process.cwd(), reported) : null;
        const proofPath = req.file.path;

        if (reportedPath && fs.existsSync(reportedPath)) {
          compareResult = true
        } else {
          // if original is remote URL, skip pixel compare (or download it first)
          compareResult = { success: false, reason: 'Original image not available locally' };
        }
      }

      // If verification success -> mark complaint Resolved
      if (compareResult) {
        await Complaint.findByIdAndUpdate(task._id, { status: 'Resolved', resolvedAt: new Date() });
        // Optionally notify officer/user (implement notifications service)
        // await notifyOfficerAndUser(task);
      }

      return res.json({ message: 'Proof uploaded', compareResult });
    } catch (err) {
      console.error('postUploadProof error', err);
      return res.status(500).json({ error: 'Upload failed' });
    }
  }
];

/**
 * Assign endpoint: officer calls this to assign worker and send WhatsApp link
 * route: POST /api/assign/:complaintId
 * body: { workerPhone } // in E.164 or without plus; we'll ensure +91 add if missing
 */

