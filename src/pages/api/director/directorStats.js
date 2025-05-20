import User from '../../../models/User';
import Status from '../../../models/Status';
import { connect } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connect();

    // Get all unique project titles from students
    const projects = await User.aggregate([
      { $match: { role: 'student', projectTitle: { $exists: true, $ne: '' } } },
      { $group: { _id: '$projectTitle' } }
    ]);

    const projectTitles = projects.map(p => p._id);
    const totalProjects = projectTitles.length;

    // Initialize counters
    let approvedProjects = 0;
    let rejectedProjects = 0;
    let pendingProjects = 0;
    
    let supervisorApproved = 0;
    let qaApproved = 0;
    let supervisorRejected = 0;
    let qaRejected = 0;
    let supervisorPending = 0;
    let qaPending = 0;

    // Check status for each project
    for (const title of projectTitles) {
      // Get all students in this project
      const students = await User.find({ 
        role: 'student', 
        projectTitle: title 
      }).select('_id');

      const studentIds = students.map(s => s._id);
      
      // Get statuses for all students in the project
      const statuses = await Status.find({ studentId: { $in: studentIds } });

      if (statuses.length === 0) {
        pendingProjects++;
        continue;
      }

      // Flags for project status
      let isApproved = true;
      let isRejected = false;
      let isPending = false;
      
      let supervisorAllApproved = true;
      let qaAllApproved = true;
      let supervisorAllRejected = true;
      let qaAllRejected = true;

      for (const status of statuses) {
        // Check all required fields
        const supervisorFields = [
          status.supervisorCvReview,
          status.supervisorFypReview,
          status.supervisorVideoReview,
          status.supervisorBannerReview
        ];

        const qaFields = [
          status.qaCvReview,
          status.qaFypReview,
          status.qaVideoReview,
          status.qaBannerReview
        ];

        // Check if any field is not approved
        if (
          supervisorFields.some(f => f !== 'approved') ||
          qaFields.some(f => f !== 'approved')
        ) {
          isApproved = false;
        }

        // Check if all fields are rejected
        if (
          supervisorFields.every(f => f === 'rejected') ||
          qaFields.every(f => f === 'rejected')
        ) {
          isRejected = true;
        }

        // Check for pending status
        if (
          supervisorFields.some(f => f === 'pending') ||
          qaFields.some(f => f === 'pending')
        ) {
          isPending = true;
        }

        // Check supervisor approval
        if (supervisorFields.some(f => f !== 'approved')) {
          supervisorAllApproved = false;
        }

        // Check QA approval
        if (qaFields.some(f => f !== 'approved')) {
          qaAllApproved = false;
        }

        // Check supervisor rejection
        if (supervisorFields.some(f => f !== 'rejected')) {
          supervisorAllRejected = false;
        }

        // Check QA rejection
        if (qaFields.some(f => f !== 'rejected')) {
          qaAllRejected = false;
        }
      }

      // Count project status
      if (isApproved) {
        approvedProjects++;
      } else if (isRejected) {
        rejectedProjects++;
      } else if (isPending) {
        pendingProjects++;
      }

      // Count supervisor/QA status
      if (supervisorAllApproved) {
        supervisorApproved++;
      }
      if (qaAllApproved) {
        qaApproved++;
      }
      if (supervisorAllRejected) {
        supervisorRejected++;
      }
      if (qaAllRejected) {
        qaRejected++;
      }
      if (!supervisorAllApproved && !supervisorAllRejected) {
        supervisorPending++;
      }
      if (!qaAllApproved && !qaAllRejected) {
        qaPending++;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalProjects: {
          total: totalProjects,
          details: [
            { label: 'Supervisor', value: await User.countDocuments({ role: 'supervisor' }) },
            { label: 'QA', value: await User.countDocuments({ role: 'qa' }) }
          ]
        },
        approvedProjects: {
          total: approvedProjects,
          details: [
            { label: 'Supervisor', value: supervisorApproved },
            { label: 'QA', value: qaApproved }
          ]
        },
        rejectedProjects: {
          total: rejectedProjects,
          details: [
            { label: 'Supervisor', value: supervisorRejected },
            { label: 'QA', value: qaRejected }
          ]
        },
        pendingProjects: {
          total: pendingProjects,
          details: [
            { label: 'Supervisor', value: supervisorPending },
            { label: 'QA', value: qaPending }
          ]
        }
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}