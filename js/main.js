const MAP = L.map('map_id').setView([38, -95], 4);
L.tileLayer.provider('CartoDB.Positron').addTo(MAP);

var info = L.control();

info.onAdd = function (MAP) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = '<h4>Texas</h4>' +  (props ?
    '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
    : 'Hover over a state');
};

info.addTo(MAP);
