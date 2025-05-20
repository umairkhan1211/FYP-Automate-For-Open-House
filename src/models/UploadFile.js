import mongoose from 'mongoose';

const UploadFileSchema = new mongoose.Schema({
  uploadType: {
    type: String,
    required: true,
    enum: ['cvTemplate', 'fypDocument', 'video', 'banner', 'assignment']
  },
  filePath: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UploadFile = mongoose.models.UploadFile || mongoose.model('UploadFile', UploadFileSchema);
export default UploadFile;