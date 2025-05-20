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
    let rejectedProjects = 0;
    let supervisorRejected = 0;
    let qaRejected = 0;

    for (const projectTitle of uniqueProjectTitles) {
      const projectStatuses = await Status.find({ projectTitle });

      if (projectStatuses.length > 0) {
        // Check if any member in this project has any rejection
        const hasRejection = projectStatuses.some(status => {
          const fields = [
            'cvStatus', 'fypStatus', 'videoStatus', 'bannerStatus',
            'supervisorCvReview', 'supervisorFypReview', 'supervisorVideoReview', 'supervisorBannerReview',
            'qaCvReview', 'qaFypReview', 'qaVideoReview', 'qaBannerReview'
          ];
          return fields.some(field => status[field] === 'rejected');
        });

        if (hasRejection) {
          rejectedProjects++;
          
          // Check supervisor rejections
          const hasSupervisorRejection = projectStatuses.some(status => {
            return [
              'supervisorCvReview', 'supervisorFypReview',
              'supervisorVideoReview', 'supervisorBannerReview'
            ].some(field => status[field] === 'rejected');
          });

          // Check QA rejections
          const hasQARejection = projectStatuses.some(status => {
            return [
              'qaCvReview', 'qaFypReview',
              'qaVideoReview', 'qaBannerReview'
            ].some(field => status[field] === 'rejected');
          });

          if (hasSupervisorRejection) supervisorRejected++;
          if (hasQARejection) qaRejected++;
        }
      }
    }

    res.status(200).json({
      success: true,
      totalRejected: rejectedProjects,
      details: {
        supervisor: supervisorRejected,
        qa: qaRejected
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}