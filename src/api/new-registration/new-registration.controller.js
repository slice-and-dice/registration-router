const {
  routeMisConnectorService,
  routeNotifyService,
  routeFsaService
} = require("../../services/");
const store = require("../../store");
const winston = require("winston");

module.exports = async data => {
  winston.info(`newregistration.controller called`);

  // set a flag of 'acceptedByLa' to false if the flag does not already exist.
  // this shows that the registration is either new or updated (update model W.I.P), and the new data has not yet been accepted by an LA as being valid.
  // the flag will be set to a truthy value when it is returned by an LA.
  data.acceptedByLa = data.acceptedByLa || false;

  // TODO: use a new service to split the registration data into 'original registration fields' and 'new registration fields'

  let registrationData = Object.assign({}, data.registrationData);

  registrationData["fsa_rn"] = data["fsa-rn"];

  try {
    const routing = await store.getLaRouting(data.localAuthority.id);
    const destinationResults = [];
    const routePromises = [];

    if (
      (await store
        .getMasterRouting()
        .then(masterRouting => masterRouting.routeToLAs)) === true
    ) {
      if (
        routing.emailConfig.active === true &&
        routing.emailConfig.recipients.length >= 1
      ) {
        routePromises.push(
          routeNotifyService.send(registrationData, routing.emailConfig)
        );
      }

      if (routing.misConfig.active === true) {
        routePromises.push(
          routeMisConnectorService.send(registrationData, data.localAuthority)
        );
      }
    }

    if (
      (await store
        .getMasterRouting()
        .then(masterRouting => masterRouting.routeToFSA)) === true
    ) {
      if (routing.fsa === true) {
        routePromises.push(
          routeFsaService.send(registrationData, data.localAuthority.id)
        );
      }
    }

    return Promise.all(routePromises)
      .then(responses => {
        winston.info(`newregistration.controller successful`);
        const jsonResponse = { sentSuccessfully: responses };
        return jsonResponse;
      })
      .catch(err => {
        winston.error(`newregistration.controller failed: ${err}`);
        return err;
      });
  } catch (err) {
    winston.error(`newregistration.controller failed: ${err}`);
    return err;
  }
};
