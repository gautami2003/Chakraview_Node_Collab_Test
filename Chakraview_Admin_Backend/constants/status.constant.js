const COMMON_STATUS = {
  ACTIVE: 'ACTIVE',
  IN_ACTIVE: 'IN_ACTIVE',
  DELETED: 'DELETED',
};

module.exports = {
  COMMON_STATUS,
  COMMON_STATUS_ARRAY: [...Object.values(COMMON_STATUS)],
};