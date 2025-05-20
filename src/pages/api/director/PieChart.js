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

    let approvedProjects = 0;
    let rejectedProjects = 0;
    let pendingProjects = 0;

    // Check each project's status
    for (const projectTitle of projects) {
      if (!projectTitle) continue;

      // Get all members of this project with their IDs
      const members = await User.find({ projectTitle }).select('_id');
      const memberIds = members.map(m => m._id);

      // Get all status records for these members
      const statuses = await Status.find({ studentId: { $in: memberIds } });

      // If no statuses found, consider as pending
      if (statuses.length === 0) {
        pendingProjects++;
        continue;
      }

      // Check if project is approved (ALL fields approved for ALL members)
      const isApproved = checkProjectApproved(statuses);
      
      // Check if project is rejected (ANY field rejected for ANY member)
      const isRejected = checkProjectRejected(statuses);
      
      // Check if project is pending (not approved or rejected, but has pending fields)
      const isPending = !isApproved && !isRejected && checkProjectPending(statuses);

      if (isApproved) {
        approvedProjects++;
      } else if (isRejected) {
        rejectedProjects++;
      } else if (isPending) {
        pendingProjects++;
      } else {
        // If none of the above, consider as pending
        pendingProjects++;
      }
    }

    res.status(200).json({
      approvedProjects,
      rejectedProjects,
      pendingProjects,
      totalProjects
    });

  } catch (error) {
    console.error('Error in projectStatusStats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Helper function to check if project is approved (ALL fields approved for ALL members)
function checkProjectApproved(statuses) {
  const allFields = [
    'cvStatus', 'fypStatus', 'videoStatus', 'bannerStatus',
    'supervisorCvReview', 'supervisorFypReview', 'supervisorVideoReview', 'supervisorBannerReview',
    'qaCvReview', 'qaFypReview', 'qaVideoReview', 'qaBannerReview'
  ];

  return statuses.every(status => {
    return allFields.every(field => status[field] === 'approved');
  });
}

// Helper function to check if project is rejected (ANY field rejected for ANY member)
function checkProjectRejected(statuses) {
  const allFields = [
    'cvStatus', 'fypStatus', 'videoStatus', 'bannerStatus',
    'supervisorCvReview', 'supervisorFypReview', 'supervisorVideoReview', 'supervisorBannerReview',
    'qaCvReview', 'qaFypReview', 'qaVideoReview', 'qaBannerReview'
  ];

  return statuses.some(status => {
    return allFields.some(field => status[field] === 'rejected');
  });
}

// Helper function to check if project has pending fields (not approved or rejected)
function checkProjectPending(statuses) {
  const allFields = [
    'cvStatus', 'fypStatus', 'videoStatus', 'bannerStatus',
    'supervisorCvReview', 'supervisorFypReview', 'supervisorVideoReview', 'supervisorBannerReview',
    'qaCvReview', 'qaFypReview', 'qaVideoReview', 'qaBannerReview'
  ];

  return statuses.some(status => {
    return allFields.some(field => status[field] === 'pending');
  });
}