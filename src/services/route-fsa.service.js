const winston = require('winston');

const send = async (registrationData, localAuthority) => {
  winston.info('routeFsaService.send called');

  // TODO: send 'core registration fields' (e.g. registrationData.core) to FHRS connector
  // TODO: send 'enhanced registration fields' (e.g. registrationData.enhanced) to MIS connector
  console.log('DATA SENT TO FSA: ', registrationData);
}

module.exports = {
  send
};