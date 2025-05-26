// components/Director_departments/ProjectsTable.js
import React, { useState } from "react";
import { motion } from "framer-motion";

const ProjectsTable = ({ projects }) => {
  const [entriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Group projects by projectTitle
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.projectTitle]) {
      acc[project.projectTitle] = [];
    }
    acc[project.projectTitle].push(project);
    return acc;
  }, {});

  // Flatten the grouped projects for display
  const displayProjects = Object.entries(groupedProjects).flatMap(
    ([title, group]) => {
      const firstProject = group[0];
      return [
        {
          isGroupHeader: true,
          projectTitle: title,
          supervisorName: firstProject.supervisorName,
          groupMembers: group,
        },
        ...group,
      ];
    }
  );

  // Calculate completion percentage
  const calculateCompletion = (project) => {
    let total = 0;
    let completed = 0;

    // Student status checks
    if (project.cvStatus === "approved") completed++;
    if (project.fypStatus === "approved") completed++;
    if (project.videoStatus === "approved") completed++;
    if (project.bannerStatus === "approved") completed++;
    total += 4;

    // Supervisor status checks
    if (project.supervisorCvReview === "approved") completed++;
    if (project.supervisorFypReview === "approved") completed++;
    if (project.supervisorVideoReview === "approved") completed++;
    if (project.supervisorBannerReview === "approved") completed++;
    total += 4;

    // QA status checks
    if (project.qaCvReview === "approved") completed++;
    if (project.qaFypReview === "approved") completed++;
    if (project.qaVideoReview === "approved") completed++;
    if (project.qaBannerReview === "approved") completed++;
    total += 4;

    return Math.round((completed / total) * 100);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-white";
    let textColor = "text-gray-800";

    if (status === "approved") {
      bgColor = "bg-green-100";
      textColor = "text-green-800";
    } else if (status === "rejected") {
      bgColor = "bg-red-100";
      textColor = "text-red-800";
    } else if (status === "pending") {
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
    } else if (status === "uploaded") {
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}
      >
        {status || "N/A"}
      </span>
    );
  };

  // Pagination Logic
  const totalPages = Math.max(
    1,
    Math.ceil(displayProjects.length / entriesPerPage)
  );
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = displayProjects.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl bg-white p-5 dark:bg-slate-800 dark:text-white transition-all duration-300"
    >
      {projects.length === 0 ? (
        <div className="text-center text-base font-semibold text-[#0069D9] dark:text-white">
          No Projects Found
        </div>
      ) : (
        <>
          <motion.table
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-w-full border-collapse rounded-lg"
          >
            <thead>
              <tr className="text-sm md:text-base font-semibold text-center bg-[#0069D9] text-white dark:bg-white dark:text-[#0069D9]">
                <th className="px-4 py-2">Project Title</th>
                <th className="px-4 py-2">Supervisor</th>
                <th className="px-4 py-2">Group Members</th>
                <th className="px-4 py-2">Student Status</th>
                <th className="px-4 py-2">Supervisor Review</th>
                <th className="px-4 py-2">QA Review</th>
                <th className="px-4 py-2">Completion</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => {
                if (item.isGroupHeader) {
                  // Group header row
                  return (
                    <motion.tr
                      key={`header-${item.projectTitle}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b text-[#0069D9] dark:text-white border-slate-300 text-sm md:text-sm text-center bg-gray-100 dark:bg-slate-700"
                    >
                      <td
                        className="px-4 py-3 font-bold capitalize"
                        rowSpan={item.groupMembers.length + 1}
                      >
                        {item.projectTitle}
                      </td>

                      <td
                        className="px-4 py-3 font-bold capitalize"
                        rowSpan={item.groupMembers.length + 1}
                      >
                        {item.supervisorName}
                      </td>
                    </motion.tr>
                  );
                } else {
                  // Member row
                  const project = item;
                  return (
                    <motion.tr
                      key={project.rollNumber}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b text-[#0069D9] dark:text-white border-slate-300 text-sm md:text-sm text-center"
                    >
                      <td className="px-4 py-3 font-bold capitalize">
                        {project.rollNumber}
                      </td>

                      {/* Student Status */}
                      <td className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-1">
                          <div>
                            <span className="text-xs block">CV: </span>
                            <StatusBadge status={project.cvStatus} />
                          </div>
                          <div>
                            <span className="text-xs block">Doc: </span>
                            <StatusBadge status={project.fypStatus} />
                          </div>
                          <div>
                            <span className="text-xs block">Video: </span>
                            <StatusBadge status={project.videoStatus} />
                          </div>
                          <div>
                            <span className="text-xs block">Banner: </span>
                            <StatusBadge status={project.bannerStatus} />
                          </div>
                        </div>
                      </td>

                      {/* Supervisor Review */}
                      <td className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-1">
                          <div>
                            <span className="text-xs block">CV: </span>
                            <StatusBadge status={project.supervisorCvReview} />
                          </div>
                          <div>
                            <span className="text-xs block">Doc: </span>
                            <StatusBadge status={project.supervisorFypReview} />
                          </div>
                          <div>
                            <span className="text-xs block">Video: </span>
                            <StatusBadge
                              status={project.supervisorVideoReview}
                            />
                          </div>
                          <div>
                            <span className="text-xs block">Banner: </span>
                            <StatusBadge
                              status={project.supervisorBannerReview}
                            />
                          </div>
                        </div>
                      </td>

                      {/* QA Review */}
                      <td className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-1">
                          <div>
                            <span className="text-xs block">CV: </span>
                            <StatusBadge status={project.qaCvReview} />
                          </div>
                          <div>
                            <span className="text-xs block">Doc: </span>
                            <StatusBadge status={project.qaFypReview} />
                          </div>
                          <div>
                            <span className="text-xs block">Video: </span>
                            <StatusBadge status={project.qaVideoReview} />
                          </div>
                          <div>
                            <span className="text-xs block">Banner: </span>
                            <StatusBadge status={project.qaBannerReview} />
                          </div>
                        </div>
                      </td>

                      {/* Completion Percentage */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{
                                width: `${calculateCompletion(project)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {calculateCompletion(project)}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                }
              })}
            </tbody>
          </motion.table>

          {/* Pagination Controls */}
          {displayProjects.length > entriesPerPage && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-base font-semibold border-2 hover:border-[#0069D9] hover:text-[#0069D9] 
                  border-[#0069D9] text-white bg-[#0069D9] dark:text-[#0069D9] dark:bg-white dark:border-white rounded-lg 
                  ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed hover:text-white"
                      : "hover:bg-white dark:hover:bg-white dark:border-2 dark:border-[#0069D9]"
                  }`}
              >
                Previous
              </button>

              <span className="font-semibold text-xs text-[#0069D9] dark:text-white">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-base font-semibold border-2 hover:border-[#0069D9] hover:text-[#0069D9] 
                  border-[#0069D9] text-white bg-[#0069D9] dark:text-[#0069D9] dark:bg-white dark:border-white rounded-lg 
                  ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed hover:text-white"
                      : "hover:bg-white dark:hover:bg-white dark:border-2 dark:border-[#0069D9]"
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default ProjectsTable;
