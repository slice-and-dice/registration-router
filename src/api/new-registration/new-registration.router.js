const { Router } = require('express');
const newRegistrationController = require('./new-registration.controller.js');

module.exports = () => {
  const router = Router();

  router.post('', async (req, res) => {
    res.send(await newRegistrationController(req.body));
  });

  return router;
};
