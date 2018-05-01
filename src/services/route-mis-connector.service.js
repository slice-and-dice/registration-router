const winston = require("winston");
const { tascomiAuth } = require("@slice-and-dice/fsa-rof");
const request = require("request-promise-native");
const fetch = require("node-fetch");

const authorityMap = {
  "4016": {
    authorityName: "Malvern Hills District Council",
    format: "tascomiDefault"
  },
  "4011": {
    authorityName: "West Sussex County Council",
    format: "civicaDefault"
  }
};

const send = async (data, config) => {
  winston.info("route-mis-connector.service: send() called");

  mapping = authorityMap[config.id];

  const requestChain = [
    {
      url: "contacts",
      method: "PUT",
      body: {
        firstname: data.operator_first_name,
        surname: data.operator_last_name,
        title_id: "1",
        house_name_or_number: data.operator_house_name_or_number,
        street_name: data.operator_street_name
        // telephone: data.operator_contact_number,
        // email: data.operator_email,
        // company_name: data.operator_company_name
      }
    },
    {
      url: "premises",
      method: "PUT",
      body: {
        name: data.establishment_name,
        dtf_location_id: "8116316",
        f_registered: "t",
        govid: "GDVR8W-8SMADJ-P6NPQX"
      },
      requiredDataArray: [
        { source: "id", destination: "contact_id" },
        { source: "id", destination: "occupier_contact_id" }
      ]
    },
    {
      url: "food",
      method: "PUT",
      body: {
        registration_date: "now",
        main_usage_id: "42",
        responsible_officer_id: "700075",
        fh_inspection_form_id: "3",
        fs_inspection_form_id: "4"
      },
      requiredDataArray: [{ source: "id", destination: "premise_id" }]
    }
  ];

  switch (mapping.format) {
    case "tascomiDefault":
      return runRequests(requestChain);
    case "civicaDefault":
      return;
    default:
      return;
  }
};

const tascomiAPI = async (url, method, body) => {
  try {
    const auth = await tascomiAuth.generateSyncHash(
      process.env.PUBLIC_KEY,
      process.env.PRIVATE_KEY,
      process.env.NTP_SERVER
    );
    const tascomiApiOptions = {
      url: url,
      method: method,
      headers: {
        "X-Public": auth.public_key,
        "X-Hash": auth.hash
      }
    };
    if (body && method !== "GET") {
      tascomiApiOptions.form = body;
    }

    let tascomiResponse = await request(tascomiApiOptions);
    console.log(tascomiResponse);
    return tascomiResponse;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const runRequests = async requestChain => {
  for (i = 0; i < requestChain.length; i++) {
    console.log("REQUEST CHAIN:", requestChain[i]);

    const tascomiResponse = await tascomiAPI(
      process.env.BASE_API_URL + "/" + requestChain[i].url,
      requestChain[i].method,
      requestChain[i].body
    );
    if (requestChain[i + 1]) {
      requestChain[i + 1].requiredDataArray.forEach(requiredData => {
        requestChain[i + 1].body[requiredData.destination] =
          JSON.parse(tascomiResponse)[requiredData.source] || null;
      });
    }
  }
  return { success: true };
};

module.exports = {
  send
};
