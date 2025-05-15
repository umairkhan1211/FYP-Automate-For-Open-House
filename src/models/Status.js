import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNumber: { type: String, required: true },
  projectTitle: { type: String, required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // CV status
  cvStatus: {
    type: String,
    enum: ['not uploaded', 'uploaded', 'rejected', 'approved'],
    default: 'not uploaded'
  },
  supervisorCvReview: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  qaCvReview: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // FYP Document status
  fypStatus: {
    type: String,
    enum: ['not uploaded', 'uploaded', 'rejected', 'approved'],
    default: 'not uploaded'
  },
  supervisorFypReview: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  qaFypReview: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Video status
  videoStatus: {
    type: String,
    enum: ['not uploaded', 'uploaded', 'rejected', 'approved'],
    default: 'not uploaded'
  },
  supervisorVideoReview: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  qaVideoReview: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Banner status
  bannerStatus: {
    type: String,
    enum: ['not uploaded', 'uploaded', 'rejected', 'approved'],
    default: 'not uploaded'
  },
  supervisorBannerReview: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  qaBannerReview: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Metadata
  qaId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  qaName: { type: String },
  supervisorName: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update `updatedAt` every time the document is modified
statusSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Status = mongoose.models.Status || mongoose.model("Status", statusSchema);
export default Status;
