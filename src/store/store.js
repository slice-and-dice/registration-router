const store = {
  masterRouting: {
    routeToLAs: true,
    routeToFSA: true
  },
  laRouting: {
    "WOC": {
      "name": "Worcester City Council",
      "emailConfig": {
        "active": true,
        "recipients": [process.env.TEST_EMAIL || undefined]
      },
      "misConfig": {
        "active": true,
        "mapping": {}
      },
      "fsa": true
    },
    "RED": {
      "name": "Redditch Borough Council",
      "emailConfig": {
        "active": true,
        "recipients": [process.env.TEST_EMAIL || undefined]
      },
      "misConfig": {
        "active": true,
        "mapping": {}
      },
      "fsa": true
    },
    "MAV": {
      "name": "Malvern Hills District Council",
      "emailConfig": {
        "active": true,
        "recipients": [process.env.TEST_EMAIL || undefined]
      },
      "misConfig": {
        "active": true,
        "mapping": {}
      },
      "fsa": true
    }
  }
};

const randomlyFail = () => Math.random() > 1;

const getMasterRouting = () => {
  return new Promise((resolve, reject) => {
    if (randomlyFail()) {
      reject(new Error('Master routing preferences could not be found'));
    } else {
      resolve(store.masterRouting);
    }
  });
}

const getLaRouting = (localAuthority) => {
  return new Promise((resolve, reject) => {
    if (randomlyFail()) {
      reject(new Error('LA route mapping could not be found'));
    } else {
      resolve(store.laRouting[localAuthority]);
    }
  });
}

module.exports = {
  getMasterRouting,
  getLaRouting
};