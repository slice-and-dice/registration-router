const winston = require('winston');

const send = async (registrationData, localAuthority) => {
  winston.info('routeNotifyService.send called');

  // TODO: get LA email preferences from store
  // TODO: send either 'core registration fields' (e.g. registrationData.core) or full registration data to Email via GOV.UK Notify
  // ...(use Kiran's Notify code)
  console.log(`DATA SENT TO "${localAuthority}" VIA EMAIL: `, registrationData);
}

module.exports = {
  send
};