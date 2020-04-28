const fs = require('fs');

let lobsters = JSON.parse(fs.readFileSync('./json/customers.json'));
let cities = JSON.parse(fs.readFileSync('./json/cities.json'));

cities.forEach(city => {
  city.zips = city.zips.split(" ");
});
lobsters.forEach(customer => {
  let custCity = cities.find(city => city.zips.find(zip => (zip === customer['Zip Code'])) !== undefined);
  if (custCity !== undefined) {
    customer.lat = custCity.lat;
    customer.lng = custCity.lng;
  }
});

const no_lat_customers = customers.filter(customer => customer.lat === undefined)
console.log(no_lat_customers.length);


