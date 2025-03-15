const dotenv = require("dotenv").config();
const multerS3 = require('multer-s3');
const multer = require('multer');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESSKEYID,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESSKEY,
  },
});

module.exports = {
  uploadS3: multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `${Date.now()}>${file.originalname}`);
      },
    }),
  }),
  deleteFile: async (filename) => {
    try {
      const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
      };
      const result = await s3.send(new DeleteObjectCommand(deleteParams));
      return result;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },
};