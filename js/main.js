const MAP = L.map('map_id').setView([38, -95], 4);
L.tileLayer.provider('CartoDB.Positron').addTo(MAP);

const STATE_LIST = document.getElementById('stateList');
const CITY_LIST = document.getElementById('cityList');
const CITY_CARD = document.getElementById('cityCard');
const RADIUS_SLIDER = document.getElementById('radius');
const BAN_COLORS = {
  'Implementation': '#ECD420',
  'Temporary COVID-19 Repeal': '#FF00FF',
  'Proposal': '#FF6D05',
  'Formal Enactment': '#FF0101',
  'Pending': '#A200AB',
  'Repealed': '#5E4819'
}

const MARKERS = {
  city: {
    marker: undefined,
    circle: undefined,
  },
  facilities: [
    { lat: '41.8373', lng: '-87.6862', data: DATA.meta.facilities[0] },
    { lat: '33.8117', lng: '-84.2405', data: DATA.meta.facilities[1] }
  ].map(facility => {
    const facilityMarker = L.marker([facility.lat, facility.lng], {
      icon: L.icon({
        iconUrl: 'https://secureservercdn.net/166.62.110.232/cbj.b18.myftpupload.com/wp-content/uploads/2019/05/BetterEarth_Logo_2.png',

        iconSize:     [60, 20], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
      })
    });
    facilityMarker.on('click', () => {
      const facilitiy = facility.data;
      info.update(`
        <h4>${facilitiy.Facility}</h4>
        <h5>${facilitiy.Capability}</h5>
        <h6>${facilitiy.City}, ${DATA[facilitiy.State].name}</h6>
        <h6>${facilitiy.Address}</h6>
      `);
    });
    facilityMarker.addTo(MAP);
    return facilityMarker;
  }),
  lobsters: DATA.meta.lobsters.map(lobster => {
    const lobsterMarker = L.marker([lobster.lat, lobster.lng], {
      icon: L.icon({
        iconUrl: 'img/red_lobster.png',

        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      })
    });
    lobsterMarker.on('click', () => {
      info.update(`
        <img src="img/red_lobster.png" class="lobster-size"/>
        <h5 class="card-subtitle mb-1 mt-2 capitalize-this">${lobster['Street Address'].toLowerCase()}</h5>
        <h5 class="card-subtitle text-muted mt-2 mb-1 capitalize-this">${lobster.City.toLowerCase()}, ${lobster.ST}</h5>
      `);
    });
    return lobsterMarker;
  }),
  customers: DATA.meta.customers.map(customer =>{
    const customerMarker = L.marker([customer.lat, customer.lng], {
      icon: L.icon({
        iconUrl: 'https://secureservercdn.net/166.62.110.232/cbj.b18.myftpupload.com/wp-content/uploads/2019/05/BetterEarth_Brandmark.png?time=1587748296',

        iconSize:     [30, 30], // size of the icon
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      })
    });
    customerMarker.on('click', () => {
      info.update(`
        <h5 class="card-subtitle mb-2 mt-2">${customer.Customer}</h5>
        <h5 class="card-subtitle text-muted mt-2 mb-1 capitalize-this">${customer.City}, ${customer.State}</h5>
      `);
    });
    return customerMarker;
  }),
  bans: DATA.meta.bans.map(ban => {
    let banMarker =  L.circle([ban.lat, ban.lng], {
      color: BAN_COLORS[ban.Stage],
      fillColor: BAN_COLORS[ban.Stage],
      fillOpacity: 0.2,
      radius: 2000
    });
    banMarker.on('click', () => info.update(`<h4 class="card-title">${ban.City}</h4>` + createBanString(ban)));
    return banMarker;
  }),
  composters: DATA.meta.composters.map(composter => {
    let composterMarker = L.marker([composter.Lat, composter.Longitude],
      {
        icon: L.icon({
          iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
          shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

          iconSize:     [38, 95], // size of the icon
          shadowSize:   [50, 64], // size of the shadow
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        })
      }
    );
    composterMarker.on('click', () => {
      info.update(`
        <h4>${composter.Name}</h4>
        <h5>${composter.City}, ${composter.State_Province}</h5>
        <a href="${composter.URL}" target="_blank">Visit</a>
      `);
    });
    return composterMarker;
  })
}

function gotoBlogPost(url) { window.open(url, ''); }

function radiusChange(evt) { document.getElementById('composter_radius').innerText = `${evt.target.value} miles`; }
RADIUS_SLIDER.addEventListener('change', radiusChange);

const clearMap = L.control({position: 'bottomleft'});
clearMap.onAdd = () => {
  let div = L.DomUtil.create('div');
  div.innerHTML = `
    <div class="input-group">
        <button class="btn btn-outline-secondary be-btn-green-then-blue" onclick="clearAll()" type="button" id="button-addon6">Clear Map</button>
    </div>
  `;
  return div;
};
clearMap.addTo(MAP);

const legend = L.control({position: 'bottomright'});
legend.onAdd = () => {
  let div = L.DomUtil.create('div', 'info legend');
  Object.keys(BAN_COLORS).forEach(key => {
    div.innerHTML += `<i style="background: ${BAN_COLORS[key]};"></i>${key}<br>`;
  });
  return div;
};
legend.addTo(MAP);

const info = L.control();
info.update = function (content) { this._div.innerHTML = (content ? content : '<h5>' + 'Click on something!' + '</h5>'); };
info.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};
info.addTo(MAP);

CITY_CARD.innerHTML = '<h5 class="card-subtitle mb-2">Select a State!</h5>';
Object.keys(DATA).forEach(key => {
  if (key === 'meta') return;

  STATE_LIST.innerHTML += `
    <li
        id="state_${key}"
        class="list-group-item list-item-hover d-flex justify-content-between align-items-center"
        onclick="showCitiesFor('${key}')"
    >
      <span>${DATA[key].name}</span>
    </li>
  `
});

function showCitiesFor(state_key) {
  CITY_LIST.innerHTML = '';
  let searchList = [];

  DATA[state_key].cities.forEach((city, index) => {
    searchList.push(city.city)
    CITY_LIST.innerHTML += `
      <li
          id="${city.city}"
          class="list-group-item list-item-hover d-flex justify-content-between align-items-center"
          onclick="showDataFor('${state_key}', '${index}')"
      >
        <span>${city.city}</span>
      </li>
    `
  });

  $('#cityInput').autocomplete({
    source: searchList
  });
  $('#cityInput').on( "autocompleteselect", function( event, ui ) {
    $(`#${ui.item.value}`).click();
    document.getElementById(ui.item.value).scrollIntoView(true);
  } );
  showDataFor(state_key, 0);
}

function showDataFor(state_key, city_index) {
  const city = DATA[state_key].cities[city_index];
  MAP.setView([city.lat, city.lng], 8);

  if(MARKERS.city.marker !== undefined) {
    MARKERS.city.marker.remove();
    MARKERS.city.circle.remove();
  }
  MARKERS.city.marker = L.marker([city.lat, city.lng]).addTo(MAP);
  createComposterMarkers(city);
  createPOICircles(state_key, city);

  let cardString = `<h4 class="card-title">${city.city}</h4>`;
  let cityBan = DATA.meta.bans.find(ban => (ban.lat === city.lat && city.lng === ban.lng))
  if(cityBan !== undefined) { cardString += createBanString(cityBan) }

  cardString += `<p class="card-text">Population: ${city.population}</p>`;
  CITY_CARD.innerHTML = cardString;
}

function createBanString(ban) {
  let banString = `
      <h6 class="card-subtitle mb-1 mt-2">Stage: ${ban.Stage}</h6>
      <h6 class="card-subtitle text-muted mt-2 mb-1">Type: ${ban.Type}</h6>
    `;

  let proposedDate = ban['If applicable, date proposed'];
  let enactedDate = ban['If applicable, date enacted '];
  let dateStringToUse = ``;
  if(enactedDate.length !== 0 || proposedDate.length !== 0) {
    if(enactedDate.length > 0) {
      dateStringToUse = `Date Enacted: ${enactedDate}`;
    } else {
      dateStringToUse = `Date Proposed: ${proposedDate}`;
    }
  }
  banString += `<span class="card-subtitle text-muted">${dateStringToUse}</span>`;
  return banString;
}

function createComposterMarkers(city) {
  let maxDistance = Math.floor(RADIUS_SLIDER.value * 1.6);
  MARKERS.city.circle = L.circle([city.lat, city.lng], {
    color: '#bddc04',
    fillColor: '#bddc04',
    fillOpacity: 0.2,
    radius: maxDistance * 1000
  });
  MARKERS.city.circle.addTo(MAP);

  DATA.meta.composters.forEach((composter, index) => {
    let distanceInMeters = window.geolib.getPreciseDistance(
      { latitude: city.lat, longitude: city.lng },
      { latitude: composter.Lat, longitude: composter.Longitude }
    );

    if (Math.floor(distanceInMeters/1000) <= maxDistance) {
      MARKERS.composters[index].addTo(MAP);
    } else {
      MARKERS.composters[index].remove();
    }
  });
}

function showAllComposters() {
  MARKERS.composters.forEach(composter => composter.addTo(MAP));
}

function showAllBans() {
  MARKERS.bans.forEach(ban => ban.addTo(MAP));
}

function showAllLobsters() {
  MARKERS.lobsters.forEach(lobster => lobster.addTo(MAP));
}

function showAllCustomers() {
  MARKERS.customers.forEach(customer => customer.addTo(MAP));
}

function clearAll() {
  MARKERS.customers.forEach(customer => customer.remove());
  MARKERS.composters.forEach(composter => composter.remove());
  MARKERS.lobsters.forEach(lobster => lobster.remove());
  MARKERS.bans.forEach(ban => ban.remove());
  if (MARKERS.city.circle !== undefined) {
    MARKERS.city.circle.remove();
    MARKERS.city.marker.remove();
  }
  MAP.setView([38, -95], 4);
  info.update();
}

function createPOICircles(state_key, city) {
  let maxDistance = Math.floor(RADIUS_SLIDER.value * 1.6);

  DATA.meta.bans.forEach((ban, index) => {
    let distanceInMeters = window.geolib.getPreciseDistance(
      { latitude: city.lat, longitude: city.lng },
      { latitude: ban.lat, longitude: ban.lng }
    );
    if (Math.floor(distanceInMeters/1000) <= maxDistance) {
      MARKERS.bans[index].addTo(MAP);
    } else {
      MARKERS.bans[index].remove();
    }
  });

  DATA.meta.lobsters.forEach((lobster, index) => {
    let distanceInMeters = window.geolib.getPreciseDistance(
      { latitude: city.lat, longitude: city.lng },
      { latitude: lobster.lat, longitude: lobster.lng }
    );
    if (Math.floor(distanceInMeters/1000) <= maxDistance) {
      MARKERS.lobsters[index].addTo(MAP);
    } else {
      MARKERS.lobsters[index].remove();
    }
  });

  DATA.meta.customers.forEach((customer, index) => {
    let distanceInMeters = window.geolib.getPreciseDistance(
      { latitude: city.lat, longitude: city.lng },
      { latitude: customer.lat, longitude: customer.lng }
    );
    if (Math.floor(distanceInMeters/1000) <= maxDistance) {
      MARKERS.customers[index].addTo(MAP);
    } else {
      MARKERS.customers[index].remove();
    }
  });
}
