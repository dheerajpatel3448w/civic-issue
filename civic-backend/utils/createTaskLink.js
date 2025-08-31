// utils/createTaskLink.js
import jwt from 'jsonwebtoken';

export function createTaskLink(taskId) {
  const token = jwt.sign(
    { taskId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // adjust as needed
  );
  const link = `${process.env.APP_BASE_URL}/worker/task?taskId=${taskId}&token=${encodeURIComponent(token)}`;
  return link;
}
