// utils/departmentHelper.js
export function getRelatedDepartments(mainDepartment) {
  const departmentGroups = {
    'Computer Science': ['Computer Science', 'Software Engineering', 'AI'],
    'Software Engineering': ['Software Engineering', 'Computer Science', 'AI'],
    'AI': ['AI', 'Computer Science', 'Software Engineering']
    // Add more department groups as needed
  };

  return departmentGroups[mainDepartment] || [mainDepartment];
}