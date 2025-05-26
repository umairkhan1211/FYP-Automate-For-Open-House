// components/Director_departments/ComputerScienceProjects.js
import React, { useEffect, useState } from 'react';
import ProjectsTable from '../../components/Director_departments/ProjectsTable';

const ComputerEngineeringProjects = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {

        
      try {
        const response = await fetch('/api/director/getProjectsByDepartment?department=Computer Engineering', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setProjects(data.projects);
        } else {
          setError(data.message || 'Failed to fetch projects');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  if (loading) return <div className="text-center py-4 text-red-500 font-bold">Loading Computer Engineering projects...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (projects.length === 0) return <div className="text-center py-4 text-red-500 font-bold">No Computer Engineeringe Projects Found</div>;

  return <ProjectsTable projects={projects} />;
};

export default ComputerEngineeringProjects;