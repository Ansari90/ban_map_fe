'use strict';

const fs = require('fs');

let bans = JSON.parse(fs.readFileSync('./json/bans.json'));
let cities = JSON.parse(fs.readFileSync('./json/cities.json'));

cities.forEach(city => {
  bans.forEach(ban => {
    if ((city.state_id === ban.State)
      && (ban.City.toLowerCase().includes(city.city.toLowerCase()) || city.city.toLowerCase().includes(ban.City.toLowerCase()))) {
      ban.City = city.city;
      ban.lat = city.lat;
      ban.lng = city.lng;
    }
  });
});

const no_lat_bans = bans.filter(ban => ban.lat === undefined)
const states = {};
no_lat_bans.forEach(ban => {
  states[ban.State] = (states[ban.State] === undefined) ? 1 : (states[ban.State] + 1);
});
console.log(no_lat_bans.length)
console.log(no_lat_bans[0])
console.log(states);


