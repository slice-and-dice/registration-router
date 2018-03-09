const { Router } = require('express');
const newRegistration = require('./new-registration');

module.exports = () => {
  const router = Router();

  router.use('/newregistration', newRegistration());

  return router;
};
