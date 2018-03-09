const { NotifyClient } = require('notifications-node-client');
const winston = require('winston');

const send = async (registrationData, emailRoutingConfig) => {
  winston.info('route-notify.service: send() called');
  
  let notifyClient, template;
  process.env.NOTIFY_KEY ? notifyClient = new NotifyClient(process.env.NOTIFY_KEY) : null;
  process.env.TEMPLATE_ID ? template = process.env.TEMPLATE_ID : null;
  
  const emailPromiseArray = [];

  emailRoutingConfig.recipients.forEach((recipientEmail) => {
    let newEmailPromise = new Promise((resolve, reject) => {
      // TODO: remove the ability for the service to fail silently like this when out of dev
      if(!notifyClient || !template)
        resolve();
      
      notifyClient.sendEmail(template, recipientEmail, {personalisation: {'content': JSON.stringify(registrationData)}}).then(response => {
        winston.info('route-notify.service: email sent successfully');
        resolve(response);
      }).catch(err => {
        winston.error(`route-notify.service: notify failed to send email: ${err}`);
        reject(err);
      });
    });
    emailPromiseArray.push(newEmailPromise);
  });

  return Promise.all(emailPromiseArray).then(responses => {
    winston.info('route-notify.service: send() successful');
    return 'Sent to Emails listed in LA config';
  }).catch(err => {
    winston.error(`route-notify.service: send() failed: ${err}`);
    return err;
  });
}

module.exports = {
  send
};