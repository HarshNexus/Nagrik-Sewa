import mongoose, { Document, Schema } from 'mongoose';

export interface IResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    dateOfBirth: string;
    nationality: string;
    profileSummary: string;
    photo?: string;
  };
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrentJob: boolean;
    description: string;
    skills: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    startYear: string;
    endYear: string;
    percentage: string;
    grade: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    category: 'Technical' | 'Soft Skills' | 'Languages' | 'Certification';
  }>;
  certificates: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    verificationUrl?: string;
  }>;
  languages: string[];
  hobbies: string[];
  references: string;
}

export interface IResume extends Document {
  userId: string;
  data: IResumeData;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for better query performance
ResumeSchema.index({ userId: 1, updatedAt: -1 });

let Resume;
try {
  Resume = mongoose.model<IResume>('Resume');
} catch (error) {
  Resume = mongoose.model<IResume>('Resume', ResumeSchema);
}

export default Resume;