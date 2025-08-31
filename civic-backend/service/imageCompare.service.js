// services/imageCompare.js
import sharp from 'sharp';
import PNG from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs/promises';
import path from 'path';

export async function compareImages(originalPath, proofPath) {
  // Parameters
  const WIDTH = 512;
  const HEIGHT = 512;

  // Ensure output buffers of same size and grayscale to simplify
  const origBuf = await sharp(originalPath).resize(WIDTH, HEIGHT).grayscale().png().toBuffer();
  const proofBuf = await sharp(proofPath).resize(WIDTH, HEIGHT).grayscale().png().toBuffer();

  const img1 = PNG.PNG.sync.read(origBuf);
  const img2 = PNG.PNG.sync.read(proofBuf);

  const diff = new PNG.PNG({ width: WIDTH, height: HEIGHT });
  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, WIDTH, HEIGHT, { threshold: 0.15 });

  const total = WIDTH * HEIGHT;
  const diffRatio = diffPixels / total; // 0..1

  // Heuristic: if diffRatio > 0.08 => significant change detected
  const success = diffRatio > 0.08;

  return { success, diffRatio };
}
