const express = require('express');
const bodyParser = require('body-parser');
const routers = require('./api/routers');

module.exports = () => {
  const app = express();
  if (typeof process.env.STORE_API !== 'string') {
    throw new Error('Please enter a STORE_API environment variable to connect to the storage layer'); 
  }
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use('/', routers());

  return app;
};
