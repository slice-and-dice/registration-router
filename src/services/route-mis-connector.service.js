const winston = require('winston');
const { tascomiAuth } = require('@slice-and-dice/fsa-rof');

const authorityMap = {
  '4016': {
    authorityName: 'Malvern Hills District Council',
    format: 'tascomiDefault',
  },
  '4011': {
    authorityName: 'West Sussex County Council',
    format: 'civicaDefault'
  }
}

const send = async (data, config) => {
  winston.info('route-mis-connector.service: send() called');

  // TODO: get MIS connector configuration from store
  // TODO: send 'core registration fields' (e.g. registrationData.core) to MIS connector
  // winston.info('route-mis-connector.service: send() successful');

  mapping = authorityMap[config.id];

  switch (mapping.format) {
    case 'tascomiDefault':
      return tascomiConnector(data);
    case 'civicaDefault':
      return;
    default:
      return;
  }
}

const tascomiConnector = async (data) => {
  const auth = await tascomiAuth.generateSyncHash(public_key, private_key, ntpServer);

  winston.info('route-mis-connector.service: tascomiConnector() called');

  let baseOptions = {
    method: "PUT",
    headers: {
      "X-Public": auth.public_key,
      "X-Hash": auth.hash
    }
  };

  let contactOptions = Object.assign({ url: `${baseURL}/contacts`, form: {
    firstname: body.operator_first_name,
    surname: body.operator_last_name,
    postcode: body.operator_postcode,
    street_name: body.operator_address,
    telephone: body.operator_contact_number,
    email: body.operator_email,
    company_name: body.operator_company_name,
  }}, baseOptions);

  let contactResponseRaw = await request(contactOptions);
  let contactResponse = JSON.parse(contactResponseRaw);
  let contactId = contactResponse.id;

  let premisesOptions = Object.assign({ url: `${baseURL}/premises`, form: {
    name: body.establishment_name,
    govid: body.fsa_rn,
    contact_id: contactId,
    occupier_contact_id: contactId
  }}, baseOptions);

  let premisesResponseRaw = await request(premisesOptions);
  let premisesResponse = JSON.parse(premisesResponseRaw);
  let premisesId = premisesResponse.id;

  let foodOptions = Object.assign({ url: `${baseURL}/food`, form: {
    registration_date: "now",
    premise_id: premisesId
  }}, baseOptions);
  let foodResponseRaw = await request(foodOptions);
  let foodResponse = JSON.parse(foodResponseRaw);

  winston.info('route-mis-connector.service: tascomiConnector() successful');

  return { success: true, };
};

module.exports = {
  send
};