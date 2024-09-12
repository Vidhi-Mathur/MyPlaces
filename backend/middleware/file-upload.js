require('dotenv').config()
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

exports.fileUpload = multer({
    limits: { fileSize: 500000 },  
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png']
        if(allowedMimes.includes(file.mimetype))  cb(null, true) 
        else cb(new Error('Invalid mime type, only JPEG and PNG are allowed!'), false)
    }
})

exports.uploadToCloudinary = async (fileBuffer, subfolder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: `my-places/${subfolder || 'default'}`, public_id: uuidv4() },
      (error, result) => {
        if(error) return reject(error)
        resolve(result)
      }
    ).end(fileBuffer) 
  })
}