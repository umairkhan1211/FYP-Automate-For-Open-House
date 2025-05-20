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

    // Get all students in the related departments with project titles
    const students = await User.find({
      department: { $in: departmentsToQuery },
      role: 'student',
      projectTitle: { $exists: true, $ne: '' }
    });

    const uniqueProjectTitles = [...new Set(students.map(student => student.projectTitle))];
    let approvedProjects = 0;
    let supervisorApproved = 0;
    let qaApproved = 0;

    for (const projectTitle of uniqueProjectTitles) {
      const projectStatuses = await Status.find({ projectTitle });

      if (projectStatuses.length > 0) {
        // Check if all members in this project are fully approved
        const allApproved = projectStatuses.every(status => {
          const requiredFields = [
            'cvStatus', 'fypStatus', 'videoStatus', 'bannerStatus',
            'supervisorCvReview', 'supervisorFypReview', 'supervisorVideoReview', 'supervisorBannerReview',
            'qaCvReview', 'qaFypReview', 'qaVideoReview', 'qaBannerReview'
          ];

          return requiredFields.every(field => 
            !status[field] || status[field] === 'approved'
          );
        });

        if (allApproved) {
          approvedProjects++;
          
          // Check supervisor approvals
          const supervisorApprovedAll = projectStatuses.every(status => {
            return [
              'supervisorCvReview', 'supervisorFypReview', 
              'supervisorVideoReview', 'supervisorBannerReview'
            ].every(field => 
              !status[field] || status[field] === 'approved'
            );
          });

          // Check QA approvals
          const qaApprovedAll = projectStatuses.every(status => {
            return [
              'qaCvReview', 'qaFypReview', 
              'qaVideoReview', 'qaBannerReview'
            ].every(field => 
              !status[field] || status[field] === 'approved'
            );
          });

          if (supervisorApprovedAll) supervisorApproved++;
          if (qaApprovedAll) qaApproved++;
        }
      }
    }

    res.status(200).json({
      success: true,
      totalApproved: approvedProjects,
      details: {
        supervisor: supervisorApproved,
        qa: qaApproved
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}