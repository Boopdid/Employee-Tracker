module.exports = {
  quest: {
    //initial Question
    type: 'list',
    message:
      'Welcome to my Employee Management System. From where would you like to start today?',
    name: 'start', //initial roles being displayed
    choices: [
      'Add an employee to the team',
      'Add a department to the team',
      'Add a role to the team',
      'View the departments of the team',
      'View the employees of the team',
      'View all the roles of the team',
      "Update the employee's role in the team",
      "Update the employee's Manager",
      'View employees by their manager',
      'View employees by their department',
      'Delete an employee',
      'Delete a role',
      'Delete a department',
      'Total budget of a department',
      'Quit',
    ],
  },
  newEmp: (emproles, employees) => [
    {
      type: 'input',
      message: "Enter the employee's first name?",
      name: 'firstName',
    },
    {
      type: 'input',
      message: "Enter the employee's last name?",
      name: 'lastName',
    },
    {
      type: 'list',
      message: "Enter the employee's role?",
      name: 'roleId',
      choices: emproles,
    },
    {
      type: 'list',
      message: "Enter the employee's manager?", // questions popping up again
      name: 'managerId',
      choices: employees,
    },
  ],
  deptQuestions: {
    //add Department Questions for the user
    type: 'input',
    message: 'Enter the name of your department?',
    name: 'depart_name',
  },
  newRole: (departments) => [
    {
      //add Role for the user
      type: 'input',
      message: 'Enter the title of your new role?',
      name: 'title_r', //title Role for the user
    },
    {
      type: 'input',
      message: 'Enter the salary for this role?',
      name: 'salary_r',
    },
    {
      type: 'list',
      message: 'Enter the department id for this role?',
      name: 'id_r',
      choices: departments,
    },
  ],
  updateRole: (employees, roles) => [
    {
      type: 'list',
      message: 'Enter the employee you would like to update',
      name: 'id',
      choices: employees,
    },
    {
      type: 'list',
      message: "Select the employee's new role",
      name: 'roleId',
      choices: roles,
    },
  ],
  updateManager: (employees) => [
    {
      type: 'list',
      message: 'Enter the employee you would like to update',
      name: 'id',
      choices: employees,
    },
    {
      type: 'list',
      message: "Select the employee's new manager",
      name: 'managerId',
      choices: employees,
    },
  ],
  removeRole: (roles) => [
    {
      type: 'list',
      message: 'Select the role that you want to delete',
      name: 'id',
      choices: roles,
    },
  ],
  removeEmployee: (employees) => [
    {
      type: 'list',
      message: 'Select the employee you want to delete',
      name: 'id',
      choices: employees,
    },
  ],
  removeDept: (departments) => [
    {
      type: 'list',
      message: 'Select the department you want to delete',
      name: 'id',
      choices: departments,
    },
  ],
};
