const winston = require('winston');
const { tascomiAuth } = require('@slice-and-dice/fsa-rof');
const request = require('request');
const fetch = require('node-fetch');

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
      return tascomiConnector({ data });
    case 'civicaDefault':
      return;
    default:
      return;
  }
}

const tascomiConnector = async ({ data }) => {
  const auth = await tascomiAuth.generateSyncHash(process.env.PUBLIC_KEY, process.env.PRIVATE_KEY, process.env.NTP_SERVER);
  const baseURL = process.env.BASE_API_URL;

  winston.info('route-mis-connector.service: tascomiConnector() called');

  let baseOptions = {
    method: "PUT",
    headers: {
      "X-Public": auth.public_key,
      "X-Hash": auth.hash,
      'Content-Type': 'application/json'
    }
  };

  let contactBody = JSON.stringify(Object.assign({}, {
    firstname: data.operator_first_name,
    surname: data.operator_last_name,
    postcode: data.operator_postcode,
    street_name: data.operator_address,
    telephone: data.operator_contact_number,
    email: data.operator_email,
    company_name: data.operator_company_name,
  }));

  let contactOptions = Object.assign({ contactBody }, baseOptions);
  let contactResponseRaw = await fetch(`${baseURL}/contacts`, contactOptions);
  let contactResponse = await contactResponseRaw.json();
  let contactId = contactResponse.id;

  let premisesBody = JSON.stringify(Object.assign({}, {
    name: data.establishment_name,
    govid: data.fsa_rn,
    contact_id: contactId,
    occupier_contact_id: contactId,
  }));

  let premisesOptions = Object.assign({ premisesBody }, baseOptions);
  let premisesResponseRaw = await fetch(`${baseURL}/premises`, premisesOptions);
  let premisesResponse = await premisesResponseRaw.json();
  let premisesId = premisesResponse.id;

  let foodBody = JSON.stringify(Object.assign({}, {
    registration_date: "now",
    premise_id: premisesId,
  }));

  let foodOptions = Object.assign({ foodBody }, baseOptions);
  let foodResponseRaw = await fetch(`${baseURL}/food`, foodOptions);
  let foodResponse = await foodResponseRaw.json();

  winston.info('route-mis-connector.service: tascomiConnector() successful');

  return { success: true, };
};

module.exports = {
  send
};