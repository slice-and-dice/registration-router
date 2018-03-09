const winston = require('winston');

const send = async (registrationData, localAuthority) => {
  winston.info('routeMisConnectorService.send called');

  // TODO: get MIS connector configuration from store
  // TODO: send 'core registration fields' (e.g. registrationData.core) to MIS connector
  console.log(`DATA SENT TO "${localAuthority}" MIS: `, registrationData);
}

module.exports = {
  send
};