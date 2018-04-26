const winston = require('winston');
const fetch = require('node-fetch');

const send = async (registrationData, localAuthority) => {
  winston.info('route-fsa.service: send() called');
  try {
    const res = await fetch(process.env.STORE_API, { 
      method: 'POST',
      body:    JSON.stringify(registrationData),
      headers: { 'Content-Type': 'application/json' },
    });
    winston.info('route-fsa.service: send() successful');
    return 'Sent to FSA';
  } catch (err) {
    winston.info('route-fsa.service: send() failed', err);
    return err;
  }
}

module.exports = {
  send
};