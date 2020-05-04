'use strict';

const fs = require('fs');

let cities = JSON.parse(fs.readFileSync('./json/cities.json'));
let citiesWithReducedData = cities.map(city => {
  return {
    city: city.city,
    lat: city.lat,
    lng: city.lng,
    population: city.population,
    state_id: city.state_id,
  };
});

let states = JSON.parse(fs.readFileSync('./json/states.json'));
const FINAL_OBJECT = { states : [] };
states.forEach(state => {
  FINAL_OBJECT.states.push(state.short);
  FINAL_OBJECT[state.short] = { name: state.name };
  FINAL_OBJECT[state.short].cities = citiesWithReducedData.filter(city => city.state_id === state.short);
});

/*
bans 544
include state && city - 379
include cityName - 516
include state and equal cityName - 307
equal cityName = 418
ban cityName only includes = 502
 */
let bans = JSON.parse(fs.readFileSync('./json/bans.json'));
let bansWithCoords = [];
bans.forEach(ban => {
  let banCity = cities.find(city => city.state_id === ban.State && ban.City.toLowerCase() === city.city.toLowerCase());

  if (banCity !== undefined) {
    ban.lat = banCity.lat;
    ban.lng = banCity.lng
    bansWithCoords.push(ban);
  }
});

let lobsters = JSON.parse(fs.readFileSync('./json/lobsters.json'));
let lobsterToClean_1 = lobsters.find(lobster => lobster['Street Address'].toLowerCase().includes('320 universal drive north'));
lobsterToClean_1.lat = '41.354135';
lobsterToClean_1.lng = '-72.872695';

let lobsterToClean_2 = lobsters.find(lobster => lobster['Street Address'].toLowerCase().includes('303 route 10 - roxbury township'));
lobsterToClean_2.lat = '40.873482';
lobsterToClean_2.lng = '-74.649276';

FINAL_OBJECT.meta = {
  lobsters: lobsters,
  bans: bansWithCoords,
  customers: JSON.parse(fs.readFileSync('./json/customers.json')),
  composters: JSON.parse(fs.readFileSync('./json/composters.json')),
  facilities: JSON.parse(fs.readFileSync('./json/facilities.json'))
};

fs.writeFileSync('./json/data.js', 'const DATA =' + JSON.stringify(FINAL_OBJECT));
