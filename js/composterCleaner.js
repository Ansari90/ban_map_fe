'use strict';

const fs = require('fs');

let bans = JSON.parse(fs.readFileSync('./json/bans.json'));
let cities = JSON.parse(fs.readFileSync('./json/cities.json'));

// missing cities (present bans) ->
// SAUGUS, CA
// ROARING FORK VALLEY, CO
// OAHU, HI
// BARRIERS ISLANDS, NC
// NEW CANAAN, CT
// WESTPORT, CT
// DARIEN, CT
//

const BAN_CITY_TYPOS = {
  // CA
  'BERKLEY': {
    City: 'Berkeley'
  },
  'PASO ROBLES': {
    City: 'El Paso de Robles'
  },
  'CORVALLIS': {
    State: 'OR',
  },
  // FL
  'FT. MEYER BEACH': {
    City: 'Fort Myers Beach'
  },
  'HALLENDALE BEACH': {
    City: 'Hallandale Beach'
  },
  // CO
  'TOWN OF CABONDALE': {
    City: 'Carbondale'
  },
  // NH
  'PORTMOUTH': {
    City: 'Portsmouth'
  }
}

const fixBan = ban => {
  let fixedBan = BAN_CITY_TYPOS[ban.City];
  if (fixedBan === undefined) return ban;
  ban.City = fixedBan.City === undefined ? ban.City : fixedBan.City;
  ban.State = fixedBan.State === undefined ? ban.State : fixedBan.State;
}

bans.forEach(ban => {
  fixBan(ban);
  const banCity = cities.find(city => {
    const cityName = city.city.toLowerCase().replace(/-/gi," ");
    const banCityName = ban.City.toLowerCase();
    return ((city.state_id === ban.State) && (banCityName.includes(cityName) || cityName.includes(banCityName)))
  });
  if (banCity !== undefined)  {
    ban.City = banCity.city;
    ban.lat = banCity.lat;
    ban.lng = banCity.lng;
  }
});

const no_lat_bans = bans.filter(ban => ban.lat === undefined)
const states = {};
no_lat_bans.forEach(ban => {
  if (states[ban.State] === undefined) { states[ban.State] = []; }
  states[ban.State].push(ban);
});

