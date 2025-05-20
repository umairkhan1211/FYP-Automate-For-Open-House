// components/HODCard/SoftwareEngineeringProjects.js
import React, { useEffect, useState } from 'react';
import ProjectsTable from './ProjectsTable';

const SoftwareEngineeringProjects = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/HodData/getProjectsByDepartment?department=Software Engineering', {
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

  if (loading) return <div className="text-center py-4">Loading software engineering projects...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (projects.length === 0) return <div className="text-center py-4">No software engineering projects found</div>;

  return <ProjectsTable projects={projects} />;
};

export default SoftwareEngineeringProjects;