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

FINAL_OBJECT.meta = {
  bans: bans.filter(ban => ban.lat !== undefined),
  customer: JSON.parse(fs.readFileSync('./json/customers.json')),
  lobsters: JSON.parse(fs.readFileSync('./json/lobsters.json')),
  composters: JSON.parse(fs.readFileSync('./json/composters.json')),
  facilities: JSON.parse(fs.readFileSync('./json/facilities.json'))
};

fs.writeFileSync('./json/data.js', 'const DATA =' + JSON.stringify(FINAL_OBJECT));
