const { routeMisConnectorService, routeNotifyService, routeFsaService } = require('../../services/');
const store = require('../../store');
const winston = require('winston');

module.exports = async (data) => {
  winston.info('new registration controller called');

  // TODO: use a new service to split the registration data into 'original registration fields' and 'new registration fields'
  let registrationData = data.registrationData;

  try {
    const routing = await store.getLaRouting(data.localAuthority.id);
    const destinationResults = [];

    if(await store.getMasterRouting().then((masterRouting) => masterRouting.routeToLAs) === true) {
      if(routing.email === true) {
        routeNotifyService.send(registrationData, data.localAuthority.id);
        destinationResults.push('LA email');
      }

      if(routing.mis === true) {
        routeMisConnectorService.send(registrationData, data.localAuthority.id);
        destinationResults.push('LA MIS');
      }
    }

    if(await store.getMasterRouting().then((masterRouting) => masterRouting.routeToFSA) === true) {
      if(routing.fsa === true) {
        routeFsaService.send(registrationData, data.localAuthority.id);
        destinationResults.push('FSA systems');
      }
    }

    return `SUCCESS. Registration sent to: ${destinationResults}`;
  }
  catch (err) {
    winston.error(`new registration controller error: ${err}`);
    return err;
  }
};