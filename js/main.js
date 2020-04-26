function gotoBlogPost(url) { window.open(url, ''); }

function radiusChange(evt) { document.getElementById('composter_radius').innerText = `${evt.target.value} miles`; }
document.getElementById('radius').addEventListener('change', radiusChange);

const MAP = L.map('map_id').setView([38, -95], 4);
L.tileLayer.provider('CartoDB.Positron').addTo(MAP);

const STATE_LIST = document.getElementById('stateList');
const CITY_LIST = document.getElementById('cityList');
const CITY_CARD = document.getElementById('cityCard');

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
  CITY_CARD.innerHTML = '<h5 class="card-subtitle mb-2">Click on a City!</h5>';
  DATA[state_key].cities.forEach((city, index) => {
    CITY_LIST.innerHTML += `
      <li
          class="list-group-item list-item-hover d-flex justify-content-between align-items-center"
          onclick="showDataFor('${state_key}', '${index}')"
      >
        <span>${city.city}</span>
      </li>
    `
  });
}

function showDataFor(state_key, city_index) {
  const city = DATA[state_key].cities[city_index];
  let cardString = `<h4 class="card-title">${city.city}</h4>`;

  if(city.ban.length > 0) {
    let ban = city.ban[0];
    cardString += `
        <h6 class="card-subtitle text-muted mb-1 mt-2">Stage:</h6>
        <h5 class="card-subtitle mb-2">${ban.Stage}</h5>
        <h6 class="card-subtitle text-muted mt-2 mb-1">Type:</h6>
        <h5 class="card-subtitle mb-2">${ban.Type}</h5>
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
    cardString += `<h6 class="card-subtitle mb-2 mt-2 text-muted">${dateStringToUse}</h6>`;
  }

  cardString += `<p class="card-text">Population: ${city.population}</p>`;
  CITY_CARD.innerHTML = cardString;
}


var info = L.control();

info.onAdd = function (MAP) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = (props ?
    ''
    : '<h5>' + 'Click on something!' + '</h5>');
};

info.addTo(MAP);
