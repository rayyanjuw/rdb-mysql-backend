// config/role.js
const allowedRoles = {
    admin: ['admin', 'manager', 'facultyHead', 'deptHead', 'researcher'],
    manager: ['manager', 'facultyHead', 'deptHead', 'researcher'],
    facultyHead: ['facultyHead', 'deptHead', 'researcher'],
    deptHead: ['deptHead', 'researcher'],
    researcher: ['researcher']
  };
  
module.exports =  allowedRoles;
  