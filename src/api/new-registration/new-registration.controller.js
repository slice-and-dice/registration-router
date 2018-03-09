const { routeMisConnectorService, routeNotifyService, routeFsaService } = require('../../services/');
const store = require('../../store');
const winston = require('winston');

module.exports = async (data) => {
  winston.info(`newregistration.controller called`);

  // TODO: use a new service to split the registration data into 'original registration fields' and 'new registration fields'
  let registrationData = data.registrationData;

  try {
    const routing = await store.getLaRouting(data.localAuthority.id);
    const destinationResults = [];
    const routePromises = [];

    if(await store.getMasterRouting().then((masterRouting) => masterRouting.routeToLAs) === true) {
      if(routing.emailConfig.active === true && routing.emailConfig.recipients.length >= 1) {
        routePromises.push(routeNotifyService.send(registrationData, routing.emailConfig));
      }

      if(routing.misConfig.active === true) {
        routePromises.push(routeMisConnectorService.send(registrationData, routing.misConfig));
      }
    }

    if(await store.getMasterRouting().then((masterRouting) => masterRouting.routeToFSA) === true) {
      if(routing.fsa === true) {
        routePromises.push(routeFsaService.send(registrationData, data.localAuthority.id));
      }
    }

    return Promise.all(routePromises).then(responses => {
      winston.info(`newregistration.controller successful`);
      return responses;
    }).catch(err => {
      winston.error(`newregistration.controller failed: ${err}`);
      return err;
    });
  }
  catch (err) {
    winston.error(`newregistration.controller failed: ${err}`);
    return err;
  }
};