import express from 'express';
import { Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import Resume from '../models/Resume';

const router = express.Router();

// Get user's resume
router.get('/get', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const resume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      resume: resume ? resume.data : null
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume'
    });
  }
});

// Save user's resume
router.post('/save', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const resumeData = req.body;
    
    // Find existing resume or create new one
    let resume = await Resume.findOne({ userId });
    
    if (resume) {
      resume.data = resumeData;
      resume.updatedAt = new Date();
      await resume.save();
    } else {
      resume = new Resume({
        userId,
        data: resumeData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await resume.save();
    }
    
    res.json({
      success: true,
      message: 'Resume saved successfully',
      resumeId: resume._id
    });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save resume'
    });
  }
});

// Get all resumes for user (for multiple versions)
router.get('/all', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      resumes: resumes.map(resume => ({
        id: resume._id,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        title: resume.data?.personal?.fullName || 'Untitled Resume'
      }))
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes'
    });
  }
});

// Delete a resume
router.delete('/:resumeId', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { resumeId } = req.params;
    
    const resume = await Resume.findOne({ _id: resumeId, userId });
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    await Resume.deleteOne({ _id: resumeId, userId });
    
    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume'
    });
  }
});

// Generate PDF (placeholder for future implementation)
router.post('/generate-pdf', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const resumeData = req.body;
    
    // TODO: Implement PDF generation using libraries like puppeteer or jsPDF
    // For now, return a success message
    
    res.json({
      success: true,
      message: 'PDF generation feature coming soon',
      downloadUrl: null
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF'
    });
  }
});

export default router;