// config/role.js
const allowedRoles = {
    admin: ['admin', 'manager', 'dean', 'chairperson', 'researcher'],
    manager: ['manager', 'dean', 'chairperson', 'researcher'],
    dean: ['dean', 'chairperson', 'researcher'],
    chairperson: ['chairperson', 'researcher'],
    researcher: ['researcher']
  };


  const roleHierarchy = {
    admin: ['manager', 'dean', 'chairperson', 'researcher'],
    manager: ['dean', 'chairperson', 'researcher'],
    dean: ['chairperson', 'researcher'],
    chairperson: ['researcher']
};
  
module.exports =  {allowedRoles, roleHierarchy}
  