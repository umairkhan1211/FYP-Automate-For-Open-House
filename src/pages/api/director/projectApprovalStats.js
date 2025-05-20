import Status from '../../../models/Status';
import User from '../../../models/User';
import { connect } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connect();

    // Get all unique project titles
    const projects = await User.distinct('projectTitle');
    const totalProjects = projects.length;

    let supervisorApproved = 0;
    let supervisorRejected = 0;
    let qaApproved = 0;
    let qaRejected = 0;

    // Check each project's status
    for (const project of projects) {
      if (!project) continue;

      // Get all members of this project with their IDs
      const members = await User.find({ projectTitle: project }).select('_id');
      const memberIds = members.map(m => m._id);

      // Get all status records for these members
      const statuses = await Status.find({ studentId: { $in: memberIds } });

      // If no statuses found, skip this project
      if (statuses.length === 0) continue;

      // Check supervisor approval status for the project
      const isSupervisorApproved = checkAllMembersApproved(statuses, 'supervisor');
      const isSupervisorRejected = checkAnyMemberRejected(statuses, 'supervisor');

      if (isSupervisorApproved) supervisorApproved++;
      else if (isSupervisorRejected) supervisorRejected++;

      // Check QA approval status for the project
      const isQAApproved = checkAllMembersApproved(statuses, 'qa');
      const isQARejected = checkAnyMemberRejected(statuses, 'qa');

      if (isQAApproved) qaApproved++;
      else if (isQARejected) qaRejected++;
    }

    res.status(200).json({
      supervisorApproved,
      supervisorRejected,
      qaApproved,
      qaRejected,
      totalProjects
    });

  } catch (error) {
    console.error('Error in projectApprovalStats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Helper function to check if ALL members are approved for a reviewer type
function checkAllMembersApproved(statuses, reviewerType) {
  const reviewFields = [
    `${reviewerType}CvReview`,
    `${reviewerType}FypReview`,
    `${reviewerType}VideoReview`,
    `${reviewerType}BannerReview`
  ];

  return statuses.every(status => {
    return reviewFields.every(field => status[field] === 'approved');
  });
}

// Helper function to check if ANY member is rejected for a reviewer type
function checkAnyMemberRejected(statuses, reviewerType) {
  const reviewFields = [
    `${reviewerType}CvReview`,
    `${reviewerType}FypReview`,
    `${reviewerType}VideoReview`,
    `${reviewerType}BannerReview`
  ];

  return statuses.some(status => {
    return reviewFields.some(field => status[field] === 'rejected');
  });
}