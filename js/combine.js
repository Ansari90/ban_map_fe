'use strict';

const fs = require('fs');

let states = JSON.parse(fs.readFileSync('./json/states.json'));
let bans = JSON.parse(fs.readFileSync('./json/bans.json'));
let lobsters = JSON.parse(fs.readFileSync('./json/lobsters.json'));
let customers = JSON.parse(fs.readFileSync('./json/customers.json'));
let cities = JSON.parse(fs.readFileSync('./json/cities.json'));
cities.forEach(city => {
  city.zips = city.zips.split(" ");
  bans.forEach(ban => {
    if ((city.state_id.includes(ban.State) || ban.State.includes(city.state_id))
    && (ban.City.toLowerCase().includes(city.city.toLowerCase()) || city.city.toLowerCase().includes(ban.City.toLowerCase()))) {
      ban.City = city.city
      ban.lat = city.lat;
      ban.lng = city.lng
    }
  })
});

const FINAL_OBJECT = {};
states.forEach(state => FINAL_OBJECT[state.short] = { name: state.name });

Object.keys(FINAL_OBJECT).forEach(stateKey => {
  FINAL_OBJECT[stateKey].cities = cities.filter(city => city.state_id === stateKey);

  lobsters.forEach(lobster => {
    if (lobster.ST !== stateKey) return;

    let redCity = FINAL_OBJECT[stateKey].cities.find(city =>
      city.zips.find(zip => zip === lobster['Zip Code2']) !== undefined
    );
    if (redCity !== undefined) {
      redCity.lobster = lobster;
    }
  });

  customers.forEach(customer => {
    if (FINAL_OBJECT[stateKey].name.toLowerCase() === customer.State.toLowerCase()) return;

    let customerCity = FINAL_OBJECT[stateKey].cities.find(city =>
      city.zips.find(zip => zip === customer['Zip Code']) !== undefined
    );
    if (customerCity !== undefined) {
      customerCity.customer = customer;
    }
  })
});

FINAL_OBJECT.meta = {
  bans: bans,
  composters: JSON.parse(fs.readFileSync('./json/composters.json')),
  facilities: JSON.parse(fs.readFileSync('./json/facilities.json'))
};

fs.writeFileSync('./json/data.js', 'const DATA =' + JSON.stringify(FINAL_OBJECT));
