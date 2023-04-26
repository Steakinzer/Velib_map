const element = document.querySelector(".element");
const ville = prompt("Choisissez la ville");
const apiUrl = `https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=${ville}&lang=fr&rows=100&facet=name&facet=is_installed&facet=is_renting&facet=is_returning&facet=nom_arrondissement_communes`;
// const apiUrl = `https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=aubervilliers&lang=fr&rows=100&facet=name&facet=is_installed&facet=is_renting&facet=is_returning&facet=nom_arrondissement_communes`;
async function getVelibData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    let content = [];
    function initialize() {
      const map = L.map("map").setView([48.833, 2.333], 12);

      const osmLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      });
      for (i = 0; i < data.records.length; i++) {
        let marker = L.marker([
          Number(data.records[i].fields.coordonnees_geo[0]),
          Number(data.records[i].fields.coordonnees_geo[1]),
        ]).addTo(map);
        let name = data.records[i].fields.name;
        let mechanicals = data.records[i].fields.mechanical;
        let ebikes = data.records[i].fields.ebike;
        marker
          .bindPopup(
            `${name}<br>vélos mécaniques : ${mechanicals}<br>vélos éléctriques ${ebikes} `
          )
          .openPopup();
      }
      map.addLayer(osmLayer);
    }
    initialize();
    for (i = 0; i < data.records.length; i++) {
      let name = data.records[i].fields.name;
      let mechanicals = data.records[i].fields.mechanical;
      let ebikes = data.records[i].fields.ebike;
      content.push(`
      <div class="station">
          <h2>Station : ${name}</h2>
          <p>${mechanicals} classical Velibs</p>
          <p>${ebikes} electric Velibs</p>
      </div>
    `);
    }
    console.log(content.join(" "), "blablabla");
    function showVelibStation(element, time) {
      element.innerHTML = `
                                
                                ${content.join(" ")}
                          `;
    }
    let time = new Date().toLocaleString("fr-FR");
    showVelibStation(element, time);
  } catch (error) {
    console.log(error);
  }
}
getVelibData();
