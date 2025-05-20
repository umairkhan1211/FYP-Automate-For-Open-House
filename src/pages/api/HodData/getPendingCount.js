import User from '../../../models/User';
import Status from '../../../models/Status';
import { connect } from '../../../lib/db';
import { getRelatedDepartments } from '../../../../utils/departmentHelper';

export default async function handler(req, res) {
  await connect();

  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({ success: false, message: 'Department is required' });
    }

    const departmentsToQuery = department === 'Computer Science' 
      ? getRelatedDepartments(department)
      : [department];

    const students = await User.find({
      department: { $in: departmentsToQuery },
      role: 'student',
      projectTitle: { $exists: true, $ne: '' }
    });

    const uniqueProjectTitles = [...new Set(students.map(student => student.projectTitle))];
    let pendingProjects = 0;
    let supervisorPending = 0;
    let qaPending = 0;

    for (const projectTitle of uniqueProjectTitles) {
      const projectStatuses = await Status.find({ projectTitle });

      if (projectStatuses.length > 0) {
        // Check if any member has pending status
        const hasPending = projectStatuses.some(status => {
          const fields = [
            'cvStatus', 'fypStatus', 'videoStatus', 'bannerStatus',
            'supervisorCvReview', 'supervisorFypReview', 'supervisorVideoReview', 'supervisorBannerReview',
            'qaCvReview', 'qaFypReview', 'qaVideoReview', 'qaBannerReview'
          ];
          return fields.some(field => status[field] === 'pending');
        });

        // Check if any member has any rejection (rejections take priority)
        const hasRejection = projectStatuses.some(status => {
          const fields = [
            'cvStatus', 'fypStatus', 'videoStatus', 'bannerStatus',
            'supervisorCvReview', 'supervisorFypReview', 'supervisorVideoReview', 'supervisorBannerReview',
            'qaCvReview', 'qaFypReview', 'qaVideoReview', 'qaBannerReview'
          ];
          return fields.some(field => status[field] === 'rejected');
        });

        // Only count as pending if there are pending statuses and no rejections
        if (hasPending && !hasRejection) {
          pendingProjects++;
          
          // Check supervisor pending
          const hasSupervisorPending = projectStatuses.some(status => {
            return [
              'supervisorCvReview', 'supervisorFypReview',
              'supervisorVideoReview', 'supervisorBannerReview'
            ].some(field => status[field] === 'pending');
          });

          // Check QA pending
          const hasQAPending = projectStatuses.some(status => {
            return [
              'qaCvReview', 'qaFypReview',
              'qaVideoReview', 'qaBannerReview'
            ].some(field => status[field] === 'pending');
          });

          if (hasSupervisorPending) supervisorPending++;
          if (hasQAPending) qaPending++;
        }
      }
    }

    res.status(200).json({
      success: true,
      totalPending: pendingProjects,
      details: {
        supervisor: supervisorPending,
        qa: qaPending
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}