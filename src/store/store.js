const store = {
  masterRouting: {
    routeToLAs: true,
    routeToFSA: true
  },
  laRouting: {
    "LND": {
      "name": "City of London Corporation",
      "email": true,
      "mis": true,
      "fsa": true
    },
    "WOC": {
      "name": "Worcester City Council",
      "email": true,
      "mis": true,
      "fsa": true
    },
    "RED": {
      "name": "Redditch Borough Council",
      "email": true,
      "mis": true,
      "fsa": true
    },
    "MAV": {
      "name": "Malvern Hills District Council",
      "email": true,
      "mis": true,
      "fsa": true
    },
    "BRM": {
      "name": "Bromsgrove District Council",
      "email": true,
      "mis": true,
      "fsa": true
    },
    "WAW": {
      "name": "Warwick District Council",
      "email": true,
      "mis": true,
      "fsa": true
    },
    "RUG": {
      "name": "Rugby Borough Council",
      "email": true,
      "mis": true,
      "fsa": true
    },
    "NWA": {
      "name": "North Warwickshire Borough Council",
      "email": true,
      "mis": true,
      "fsa": true
    },
    "STA": {
      "name": "Stafford Borough Council",
      "email": true,
      "mis": true,
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