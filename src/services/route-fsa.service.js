const winston = require('winston');

const send = async (registrationData, localAuthority) => {
  winston.info('route-fsa.service: send() called');

  // TODO: send 'core registration fields' (e.g. registrationData.core) to FHRS connector
  // TODO: send 'enhanced registration fields' (e.g. registrationData.enhanced) to MIS connector
  winston.info('route-fsa.service: send() successful');
  return 'Sent to FSA';
}

module.exports = {
  send
};