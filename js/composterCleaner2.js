const fs = require('fs');

let customers = JSON.parse(fs.readFileSync('./json/customers.json'));
let cities = JSON.parse(fs.readFileSync('./json/cities.json'));

customers.forEach(customer => {
  let custCity = cities.find(city => city.zips.includes(customer['Zip Code']));
  if (custCity !== undefined) {
    customer.lat = custCity.lat;
    customer.lng = custCity.lng;
  }
});

const no_lat_customers = customers.filter(customer => customer.lat === undefined)
console.log(no_lat_customers.length);


