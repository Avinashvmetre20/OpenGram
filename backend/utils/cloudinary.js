require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'social-media/posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    resource_type: 'auto'
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

module.exports = upload;