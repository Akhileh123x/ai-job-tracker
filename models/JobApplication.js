import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  salary: { type: Number, default: 0 },
  jobType: { type: String, required: true },
  status: { type: String, required: true, default: 'Applied' },
  applicationLink: { type: String, default: '' },
  notes: { type: String, default: '' },
  userId: { type: String, required: true },
}, { timestamps: true });

export const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);