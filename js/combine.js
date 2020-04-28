'use strict';

const fs = require('fs');

let cities = JSON.parse(fs.readFileSync('./json/cities.json'));
cities = cities.map(city => {
  return {
    city: city.city,
    lat: city.lat,
    lng: city.lng,
    population: city.population,
    state_id: city.state_id,
  };
});

let bans = JSON.parse(fs.readFileSync('./json/bans.json'));
bans.forEach(ban => {
  let banCityName = ban.City.toLowerCase();

  cities.find(city => {
    let cityName = city.city.toLowerCase();

    if ((city.state_id.includes(ban.State) || ban.State.includes(city.state_id))
      && (banCityName.includes(cityName) || cityName.includes(banCityName))) {
      ban.lat = city.lat;
      ban.lng = city.lng

      return true;
    }
  });
});

let states = JSON.parse(fs.readFileSync('./json/states.json'));
const FINAL_OBJECT = {};
states.forEach(state => FINAL_OBJECT[state.short] = { name: state.name });

Object.keys(FINAL_OBJECT).forEach(stateKey => {
  FINAL_OBJECT[stateKey].cities = cities.filter(city => city.state_id === stateKey);
});

let lobsters = JSON.parse(fs.readFileSync('./json/lobsters.json'));
lobsters.forEach(lobster => {
  if (lobster['Street Address'].toLowerCase().includes('320 universal drive north')) {
    lobster.lat = '41.354135';
    lobster.lng = '-72.872695';
    return;
  }
  if (lobster['Street Address'].toLowerCase().includes('303 route 10 - roxbury township')) {
    lobster.lat = '40.873482';
    lobster.lng = '-74.649276';
    return;
  }
})

FINAL_OBJECT.meta = {
  bans: bans.filter(ban => ban.lat !== undefined),
  customers: JSON.parse(fs.readFileSync('./json/customers.json')),
  lobsters: lobsters,
  composters: JSON.parse(fs.readFileSync('./json/composters.json')),
  facilities: JSON.parse(fs.readFileSync('./json/facilities.json'))
};

fs.writeFileSync('./json/data.js', 'const DATA =' + JSON.stringify(FINAL_OBJECT));
