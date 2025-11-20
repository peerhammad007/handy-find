const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../utils/imageUpload');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// Authenticated upload (requires JWT)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Invalid file type' });
    }
    const url = await uploadImage(req.file.buffer, req.file.originalname);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', detail: err.message });
  }
});

// Public upload (no auth) - used for pre-auth flows like registration
router.post('/public', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Invalid file type' });
    }
    const url = await uploadImage(req.file.buffer, req.file.originalname);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', detail: err.message });
  }
});

module.exports = router;
