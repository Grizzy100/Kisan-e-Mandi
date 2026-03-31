import multer from "multer";

// We use memoryStorage so the file is available as a Buffer (req.file.buffer)
// This is more efficient for cloud deployments (Vercel/Render) and avoids 
// dependency conflicts with legacy storage engines.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50MB max
  },
});

export default upload;
