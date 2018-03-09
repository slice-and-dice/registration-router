const winston = require('winston');

const send = async (registrationData, misRoutingConfig) => {
  winston.info('route-mis-connector.service: send() called');

  // TODO: get MIS connector configuration from store
  // TODO: send 'core registration fields' (e.g. registrationData.core) to MIS connector
  winston.info('route-mis-connector.service: send() successful');
  return 'Sent to MIS Connector';
}

module.exports = {
  send
};