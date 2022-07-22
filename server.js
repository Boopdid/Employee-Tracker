const inquirer = require('inquirer');
const questions = require('./helpers/cmd-prompts');
const table = require('console.table');
const mysql = require('mysql2');

//server connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3306,
  // Your username
  user: 'root',
  database: 'employees_db',
});

//functions for Questions popping after the welcome message is displayed
async function begin() {
  const yourAnswer = await inquirer.prompt(questions.quest);
  switch (yourAnswer.start) {
    case 'Add an employee to the team':
      newEmp();
      break;
    case 'Add a department to the team':
      addDept();
      break;
    case 'Add a role to the team':
      addRole();
      break;
    case 'View the departments of the team': // working
      viewDept();
      break;
    case 'View the employees of the team':
      viewEmp();
      break;
    case 'View all the roles of the team':
      allRoles();
      break;
    case "Update the employee's role in the team":
      updateRole();
      break;
    case "Update the employee's Manager":
      updateManager();
      break;
    case 'View employees by their manager':
      viewEmpManager();
      break;
    case 'View employees by their department':
      viewEmpDept();
      break;
    case 'Delete an employee':
      deleteEmp();
      break;
    case 'Delete a role':
      deleteRole();
      break;
    case 'Delete a department':
      deleteDept();
      break;
    case 'Total budget of a department':
      viewTotalBudget();
      break;
    case 'Quit':
      connection.end();
      break;
  }
}

// adding employees, departments and

//add employee by entering the employee’s first name, last name, role, and manager
async function newEmp() {
  let empValue =
    "SELECT id as value, CONCAT(firstName, ' ', lastName) as name FROM employees";
  connection.query(empValue, async (err, employees) => {
    empValue = 'SELECT id as value, title as name FROM roles';
    connection.query(empValue, async (err, emproles) => {
      const employeeNew = await inquirer.prompt(
        questions.newEmp(emproles, employees)
      );
      empValue = 'INSERT INTO employees SET ?';
      connection.query(empValue, employeeNew, (err) => {
        if (err) throw err;
        console.log('New employee has been added to your team!');
        console.table(employeeNew);

        begin();
      });
    });
  });
}

//add a department by entering in a name
async function addDept() {
  const questionsDept = await inquirer.prompt(questions.deptQuestions);
  connection.query(
    'INSERT INTO departments SET ?',
    {
      departmentName: questionsDept.depart_name,
    },
    function (err) {
      if (err) throw err;
      console.log('New department has been added to your team!');
      console.table(questionsDept);
      begin();
    }
  );
}

//add a role by entering the name, salary, and department
async function addRole() {
  connection.query(
    'Select id as value, departmentName as name from departments',
    async (err, departments) => {
      const roleDetails = await inquirer.prompt(questions.newRole(departments));
      connection.query(
        'INSERT INTO roles SET ?',
        {
          title: roleDetails.title_r,
          salary: roleDetails.salary_r,
          departmentId: roleDetails.id_r,
        },
        function (err) {
          if (err) throw err;
          console.log('New Role has been added to your team!');
          console.table(roleDetails);
          begin();
        }
      );
    }
  );
}

//view departments, employees,,roles, view employee by - only roles, only managers and only departments

viewDept = () => {
  connection.query('SELECT * FROM departments ', (err, res) => {
    if (err) throw err;
    console.table(res);
    begin();
  });
};

viewEmp = () => {
  connection.query(
    'SELECT employees.id, employees.firstName, employees.lastName, roles.title, roles.salary, departments.departmentName, employee_m.firstName AS Manager_firstName, employee_m.lastName AS Manager_lastName FROM employees JOIN roles ON employees.roleId = roles.id JOIN departments ON roles.departmentId = departments.id LEFT JOIN employees AS employee_m ON employees.managerId = employee_m.id',
    function (err, res) {
      if (err) throw err;
      console.table(res);
      begin();
    }
  );
};

allRoles = () => {
  connection.query(
    'SELECT roles.id, roles.title, roles.salary, departments.departmentName FROM roles JOIN departments ON roles.departmentId = departments.id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      begin();
    }
  );
};

async function viewEmpManager() {
  connection.query(
    "SELECT id as value,  CONCAT(firstName, ' ', lastName) as name FROM employees",
    async (err, employee) => {
      const { managerid } = await inquirer.prompt([
        {
          type: 'list',
          message: 'Choose a manager:',
          name: 'managerid',
          choices: employee,
        },
      ]);
      connection.query(
        `SELECT firstName, lastName FROM employees WHERE managerId=${managerid}`,
        function (err, res) {
          if (err) throw err;

          console.table(res);
          begin();
        }
      );
    }
  );
}

async function viewEmpDept() {
  connection.query(
    'Select id as value, departmentName as name from departments',
    async (err, department) => {
      const { departmentId } = await inquirer.prompt([
        {
          type: 'list',
          message: 'Select a Department:',
          name: 'departmentId',
          choices: department,
        },
      ]);
      connection.query(
        'SELECT employees.firstName, employees.lastName, roles.title, roles.salary, departments.departmentName AS department FROM employees LEFT JOIN roles ON employees.roleId = roles.id LEFT JOIN departments ON roles.departmentId = departments.id where departments.id = ?',
        departmentId,
        function (err, res) {
          if (err) throw err;
          console.log('You can now view your employees by their department!');
          console.table(res);
          begin();
        }
      );
    }
  );
}

//All the updates

function updateRole() {
  let employeesQuery =
    "select id as value, CONCAT(firstName, ' ', lastName) as name from employees";
  connection.query(employeesQuery, async (err, employees) => {
    let rolesQuery = 'SELECT id as value, title as name FROM roles';
    connection.query(rolesQuery, async (err, roles) => {
      const employeeUpdate = await inquirer.prompt(
        questions.updateRole(employees, roles)
      );
      connection.query(
        'UPDATE employees SET roleId = ? WHERE id = ?',
        [employeeUpdate.roleId, employeeUpdate.id],
        async function (err, data) {
          if (err) throw err;
          console.log('Role has been updated!');
          connection.query(
            'SELECT employees.id, employees.firstName, employees.lastName, roles.title, roles.salary, departments.departmentName, employee_m.firstName AS Manager_firstName, employee_m.lastName AS Manager_lastName FROM employees JOIN roles ON employees.roleId = roles.id JOIN departments ON roles.departmentId = departments.id LEFT JOIN employees AS employee_m ON employees.managerId = employee_m.id where employees.id = ?',
            employeeUpdate.id,
            function (err, employee) {
              console.table(employee);
              begin();
            }
          );
        }
      );
    });
  });
}

function updateManager() {
  let employeesQuery =
    "select id as value, CONCAT(firstName, ' ', lastName) as name from employees";
  connection.query(employeesQuery, async (err, employees) => {
    const employeeUpdate = await inquirer.prompt(
      questions.updateManager(employees)
    );
    connection.query(
      'UPDATE employees SET managerId = ? WHERE id = ?',
      [employeeUpdate.managerId, employeeUpdate.id],
      async function (err, data) {
        if (err) throw err;
        console.log('Manager has been updated!');
        connection.query(
          'SELECT employees.id, employees.firstName, employees.lastName, roles.title, roles.salary, departments.departmentName, employee_m.firstName AS Manager_firstName, employee_m.lastName AS Manager_lastName FROM employees JOIN roles ON employees.roleId = roles.id JOIN departments ON roles.departmentId = departments.id LEFT JOIN employees AS employee_m ON employees.managerId = employee_m.id where employees.id = ?',
          employeeUpdate.id,
          function (err, employee) {
            console.table(employee);
            begin();
          }
        );
      }
    );
  });
}

// Deleting functions

async function deleteRole() {
  let roleQuery = 'SELECT id as value, title as name FROM roles';
  connection.query(roleQuery, async (err, roles) => {
    const roleDetails = await inquirer.prompt(questions.removeRole(roles));
    connection.query(
      'DELETE FROM roles WHERE id = ?',
      roleDetails.id,
      function (err) {
        if (err) throw err;
        console.log('Role has been deleted from your team!');
        console.table(roleDetails);
        begin();
      }
    );
  });
}

async function deleteEmp() {
  let empQuery =
    "SELECT id as value, CONCAT(firstName, ' ', lastName) as name FROM employees";
  connection.query(empQuery, async (err, employees) => {
    const empDetails = await inquirer.prompt(
      questions.removeEmployee(employees)
    );
    connection.query(
      'DELETE FROM employees WHERE id = ?',
      empDetails.id,
      function (err) {
        if (err) throw err;
        console.log('Employee has been deleted from your team!');
        console.table(empDetails);
        begin();
      }
    );
  });
}

async function deleteDept() {
  let deparmentQuery =
    'SELECT id as value, departmentName as name FROM departments';
  connection.query(deparmentQuery, async (err, departments) => {
    const deptDetails = await inquirer.prompt(
      questions.removeDept(departments)
    );
    connection.query(
      'DELETE FROM departments WHERE id = ?',
      deptDetails.id,
      function (err) {
        if (err) throw err;
        console.log('Department has been deleted from your team!');
        console.table(deptDetails);
        begin();
      }
    );
  });
}

// View buget of departments
const viewTotalBudget = () => {
  connection.query(
    'SELECT roles.departmentId AS id,departments.departmentName AS department, SUM(salary) AS Budget FROM roles INNER JOIN departments ON roles.departmentId = departments.id GROUP BY  roles.departmentId',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      begin();
    }
  );
};

begin();
