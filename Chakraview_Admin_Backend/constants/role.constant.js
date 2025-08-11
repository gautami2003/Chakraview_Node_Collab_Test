const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
};

module.exports = {
  ROLES,

  ROLES_ARRAY: [...Object.values(ROLES)],
};